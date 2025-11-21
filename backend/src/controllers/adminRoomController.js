// backend/src/controllers/adminRoomController.js
import { supabase } from "../db/supabase.js";

// GET all rooms with attributes
export const getRoomsWithAttributes = async (req, res) => {
  try {
    const { data: rooms, error: roomsErr } = await supabase
      .from("rooms")
      .select("*");
    if (roomsErr) throw roomsErr;

    const results = [];

    for (const r of rooms) {
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
};

// POST add room
export const addRoom = async (req, res) => {
  try {
    const { roomNumber, buildingId, floorNumber, roomCapacity, roomType } = req.body;

    const { data: roomArr, error: roomErr } = await supabase
      .from("rooms")
      .insert([{
        room_no: roomNumber,
        building_id: buildingId,
        room_capacity: roomCapacity,
        room_availability: true
      }])
      .select();
    if (roomErr) throw roomErr;

    const room = roomArr[0];

    const { data: entityArr, error: entityErr } = await supabase
      .from("entity")
      .insert([{
        entity_type: "Room",
        reference_id: room.id
      }])
      .select();
    if (entityErr) throw entityErr;

    const entity = entityArr[0];

    const { error: valueErr } = await supabase.from("value").insert([
      { entity_id: entity.id, attribute_id: 1, value_int: floorNumber },
      { entity_id: entity.id, attribute_id: 3, value_string: roomType }
    ]);
    if (valueErr) throw valueErr;

    res.json({ success: true, room });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT edit room
export const editRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const { roomNumber, buildingId, floorNumber, roomCapacity, roomType } = req.body;

    await supabase.from("rooms")
      .update({ room_no: roomNumber, building_id: buildingId, room_capacity: roomCapacity })
      .eq("id", roomId);

    const { data: entityArr } = await supabase
      .from("entity")
      .select("*")
      .eq("entity_type", "Room")
      .eq("reference_id", roomId)
      .limit(1);

    if (!entityArr || entityArr.length === 0) return res.status(404).json({ error: "Entity not found" });
    const entity = entityArr[0];

    await supabase.from("value")
      .update({ value_int: floorNumber })
      .eq("entity_id", entity.id)
      .eq("attribute_id", 1);
    await supabase.from("value")
      .update({ value_string: roomType })
      .eq("entity_id", entity.id)
      .eq("attribute_id", 3);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE room
export const deleteRoom = async (req, res) => {
  try {
    const roomId = req.params.id;

    const { data: entityArr } = await supabase
      .from("entity")
      .select("*")
      .eq("entity_type", "Room")
      .eq("reference_id", roomId)
      .limit(1);

    if (entityArr && entityArr.length > 0) {
      const entity = entityArr[0];
      await supabase.from("value").delete().eq("entity_id", entity.id);
      await supabase.from("entity").delete().eq("id", entity.id);
    }

    await supabase.from("rooms").delete().eq("id", roomId);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
