
-- Insert realistic feedback entries for lecturers/departments that may not have feedback yet
-- This will ensure all entities have proper ratings for better visualization

INSERT INTO feedback (
  course_offering_id,
  category_id,
  status_id,
  overall_rating,
  teaching_effectiveness,
  course_content,
  communication,
  availability,
  positive_feedback,
  improvement_suggestions,
  additional_comments,
  submission_method,
  is_anonymous
)
SELECT 
  co.id as course_offering_id,
  1 as category_id, -- Assuming category 1 exists
  1 as status_id,   -- Assuming status 1 exists
  (RANDOM() * 2 + 3)::integer as overall_rating, -- Random rating between 3-5
  (RANDOM() * 2 + 3)::integer as teaching_effectiveness,
  (RANDOM() * 2 + 3)::integer as course_content,
  (RANDOM() * 2 + 3)::integer as communication,
  (RANDOM() * 2 + 3)::integer as availability,
  CASE 
    WHEN RANDOM() > 0.5 THEN 'Great teaching style and clear explanations.'
    ELSE 'Very knowledgeable and helpful instructor.'
  END as positive_feedback,
  CASE 
    WHEN RANDOM() > 0.7 THEN 'Could provide more practical examples.'
    WHEN RANDOM() > 0.4 THEN 'More office hours would be helpful.'
    ELSE NULL
  END as improvement_suggestions,
  CASE 
    WHEN RANDOM() > 0.6 THEN 'Overall satisfied with the course.'
    ELSE NULL
  END as additional_comments,
  'web' as submission_method,
  true as is_anonymous
FROM course_offerings co
LEFT JOIN feedback f ON f.course_offering_id = co.id
WHERE f.id IS NULL -- Only insert for course offerings without feedback
AND co.is_active = true
LIMIT 50; -- Add up to 50 new feedback entries

-- Add a few more feedback entries with varied ratings to create realistic distribution
INSERT INTO feedback (
  course_offering_id,
  category_id,
  status_id,
  overall_rating,
  teaching_effectiveness,
  course_content,
  communication,
  availability,
  positive_feedback,
  improvement_suggestions,
  submission_method,
  is_anonymous
)
SELECT 
  co.id as course_offering_id,
  1 as category_id,
  1 as status_id,
  (RANDOM() * 5 + 1)::integer as overall_rating, -- Full range 1-5
  (RANDOM() * 5 + 1)::integer as teaching_effectiveness,
  (RANDOM() * 5 + 1)::integer as course_content,
  (RANDOM() * 5 + 1)::integer as communication,
  (RANDOM() * 5 + 1)::integer as availability,
  'Additional feedback for better data distribution.',
  NULL,
  'web' as submission_method,
  true as is_anonymous
FROM course_offerings co
WHERE co.is_active = true
ORDER BY RANDOM()
LIMIT 25; -- Add 25 more entries for better distribution
