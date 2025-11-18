require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// constants for Attribute IDs in your Attribute table
const FLOOR_NUMBER_ATTRIBUTE_ID = 1; // Floor_Number
const ROOM_TYPE_ATTRIBUTE_ID = 3;    // Room_Type

// GET all rooms with attributes
app.get("/rooms", async (req, res) => {
  try {
    // 1) get rooms
    const { data: rooms, error: roomsErr } = await supabase
      .from("rooms")
      .select("*");

    if (roomsErr) return res.status(500).json({ error: roomsErr.message });

    const results = [];

    for (const r of rooms) {
      // 2) get entity
      const { data: entityArr } = await supabase
        .from("entity")
        .select("*")
        .eq("entity_type", "Room")
        .eq("reference_id", r.id)
        .limit(1);

      let floorNumber = null;
      let roomType = null;

      if (entityArr && entityArr.length > 0) {
        const entity = entityArr[0];

        // 3) get attributes from value table
        const { data: vals } = await supabase
          .from("value")
          .select("*")
          .eq("entity_id", entity.id);

        vals.forEach(v => {
          if (v.attribute_id === 1) floorNumber = v.value_int;
          if (v.attribute_id === 3) roomType = v.value_string;
        });
      }

      results.push({
        ...r,
        floorNumber,
        roomType
      });
    }

    res.json(results);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add room
app.post("/rooms", async (req, res) => {
  try {
    const { roomNumber, buildingId, floorNumber, roomCapacity, roomType } = req.body;

    // 1) insert into rooms table
    const { data: roomArr, error: roomErr } = await supabase
      .from("rooms")
      .insert([
        {
          room_no: roomNumber,
          building_id: buildingId,
          room_capacity: roomCapacity,
          room_availability: true
        }
      ])
      .select();

    if (roomErr) return res.status(500).json({ error: roomErr.message });

    const room = roomArr[0];

    // 2) create entity entry for this room
    const { data: entityArr, error: entityErr } = await supabase
      .from("entity")
      .insert([
        {
          entity_type: "Room",
          reference_id: room.id
        }
      ])
      .select();

    if (entityErr) return res.status(500).json({ error: entityErr.message });

    const entity = entityArr[0];

    // 3) insert values: floor number & room type
    const { error: valueErr } = await supabase.from("value").insert([
      {
        entity_id: entity.id,
        attribute_id: 1,     // Floor_Number
        value_int: floorNumber
      },
      {
        entity_id: entity.id,
        attribute_id: 3,     // Room_Category
        value_string: roomType
      }
    ]);

    if (valueErr) return res.status(500).json({ error: valueErr.message });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// PUT edit room
// PUT edit room
app.put("/rooms/:id", async (req, res) => {
  try {
    const roomId = req.params.id;
    const { roomNumber, buildingId, floorNumber, roomCapacity, roomType } = req.body;

    // 1) update Rooms table
    await supabase
      .from("rooms")
      .update({
        room_no: roomNumber,
        building_id: buildingId,
        room_capacity: roomCapacity,
      })
      .eq("id", roomId);

    // 2) find entity for this room
    const { data: entityArr, error: entErr } = await supabase
      .from("entity")
      .select("*")
      .eq("entity_type", "Room")
      .eq("reference_id", roomId)
      .limit(1);

    if (entErr) return res.status(500).json({ error: entErr.message });
    if (!entityArr || entityArr.length === 0)
      return res.status(404).json({ error: "Entity not found" });

    const entity = entityArr[0];

    // 3) update value table
    await supabase
      .from("value")
      .update({ value_int: floorNumber })
      .eq("entity_id", entity.id)
      .eq("attribute_id", 1); // Floor_Number

    await supabase
      .from("value")
      .update({ value_string: roomType })
      .eq("entity_id", entity.id)
      .eq("attribute_id", 3); // Room_Type

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE room
app.delete("/rooms/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // find entity first
    const { data: entityArr } = await supabase
      .from("entity")
      .select("*")
      .eq("entity_type", "Room")
      .eq("reference_id", id)
      .limit(1);

    if (entityArr && entityArr.length > 0) {
      const entity = entityArr[0];

      await supabase.from("value").delete().eq("entity_id", entity.id);
      await supabase.from("entity").delete().eq("id", entity.id);
    }

    await supabase.from("rooms").delete().eq("id", id);

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
