USE smart_fitness;

INSERT INTO workout_meal_plans (user_id, day, exercises, meals, completed_status) VALUES 
(9, 'Monday', '[{"id":"e1","name":"Push-ups","sets":3,"reps":15,"description":"Standard form","completed":false}]', '[{"id":"m1","name":"Protein Oatmeal","type":"breakfast","calories":400,"protein":30,"carbs":45,"fat":10,"consumed":false}]', '{"exercises":[],"meals":[]}'),
(9, 'Tuesday', '[{"id":"e2","name":"Squats","sets":3,"reps":20,"description":"Bodyweight squats","completed":false}]', '[{"id":"m2","name":"Grilled Chicken Salad","type":"lunch","calories":500,"protein":42,"carbs":20,"fat":18,"consumed":false}]', '{"exercises":[],"meals":[]}'),
(9, 'Wednesday', '[{"id":"e3","name":"Plank Hold","sets":3,"reps":0,"duration":1,"description":"60 second holds","completed":false}]', '[{"id":"m3","name":"Grilled Salmon","type":"dinner","calories":600,"protein":48,"carbs":25,"fat":22,"consumed":false}]', '{"exercises":[],"meals":[]}');
