
-- First, let's assign courses to lecturers who don't have any course offerings
-- We'll match lecturers to courses from their own department when possible

-- Get the current semester ID (assuming there's a current semester)
DO $$
DECLARE
    current_semester_id INTEGER;
    lecturer_record RECORD;
    course_record RECORD;
    offering_count INTEGER := 0;
BEGIN
    -- Get current semester ID
    SELECT id INTO current_semester_id 
    FROM academic_semesters 
    WHERE is_current = true 
    LIMIT 1;
    
    -- If no current semester, use the most recent one
    IF current_semester_id IS NULL THEN
        SELECT id INTO current_semester_id 
        FROM academic_semesters 
        ORDER BY start_date DESC 
        LIMIT 1;
    END IF;
    
    RAISE NOTICE 'Using semester ID: %', current_semester_id;
    
    -- Loop through lecturers who don't have any course offerings
    FOR lecturer_record IN 
        SELECT l.id as lecturer_id, l.department_id, l.first_name, l.last_name
        FROM lecturers l
        WHERE l.is_active = true
        AND l.id NOT IN (SELECT DISTINCT lecturer_id FROM course_offerings)
    LOOP
        RAISE NOTICE 'Processing lecturer: % % (ID: %)', lecturer_record.first_name, lecturer_record.last_name, lecturer_record.lecturer_id;
        
        -- Try to find courses in the lecturer's department first
        SELECT c.id, c.course_code, c.course_name INTO course_record
        FROM courses c
        WHERE c.department_id = lecturer_record.department_id
        AND c.is_active = true
        AND c.id NOT IN (
            SELECT course_id FROM course_offerings 
            WHERE semester_id = current_semester_id
        )
        LIMIT 1;
        
        -- If no courses available in lecturer's department, pick any available course
        IF course_record.id IS NULL THEN
            SELECT c.id, c.course_code, c.course_name INTO course_record
            FROM courses c
            WHERE c.is_active = true
            AND c.id NOT IN (
                SELECT course_id FROM course_offerings 
                WHERE semester_id = current_semester_id
            )
            LIMIT 1;
        END IF;
        
        -- If we found a course, create the offering
        IF course_record.id IS NOT NULL THEN
            INSERT INTO course_offerings (
                course_id, 
                lecturer_id, 
                semester_id, 
                section, 
                enrolled_count,
                classroom,
                is_active
            ) VALUES (
                course_record.id,
                lecturer_record.lecturer_id,
                current_semester_id,
                'A',
                FLOOR(RANDOM() * 40 + 15)::INTEGER, -- Random enrollment 15-55
                'Room ' || (FLOOR(RANDOM() * 300 + 100))::TEXT, -- Random room
                true
            );
            
            offering_count := offering_count + 1;
            RAISE NOTICE 'Created offering for lecturer % with course % (%)', lecturer_record.lecturer_id, course_record.course_code, course_record.course_name;
        ELSE
            RAISE NOTICE 'No available courses found for lecturer %', lecturer_record.lecturer_id;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Total course offerings created: %', offering_count;
END $$;

-- Now let's add realistic feedback for lecturers who have no feedback
DO $$
DECLARE
    lecturer_offering_record RECORD;
    feedback_count INTEGER;
    i INTEGER;
    rating INTEGER;
    feedback_date TIMESTAMP;
    positive_comments TEXT[];
    improvement_comments TEXT[];
    additional_comments TEXT[];
    selected_positive TEXT;
    selected_improvement TEXT;
    selected_additional TEXT;
BEGIN
    -- Arrays of realistic feedback comments
    positive_comments := ARRAY[
        'Excellent teaching methodology and clear explanations',
        'Very engaging lectures with real-world examples', 
        'Well-organized course content and materials',
        'Responsive to student questions and concerns',
        'Creates a positive learning environment',
        'Great use of technology and interactive teaching tools',
        'Provides helpful feedback on assignments',
        'Makes complex topics easy to understand',
        'Encourages student participation and discussion',
        'Always available during office hours',
        'Passionate about the subject matter',
        'Fair and transparent grading system'
    ];
    
    improvement_comments := ARRAY[
        'Could provide more practice exercises',
        'Would benefit from more detailed examples',
        'Sometimes moves through material too quickly',
        'Could improve time management in lectures',
        'More variety in teaching methods would help',
        'Could provide clearer assignment instructions',
        'Would appreciate more frequent feedback',
        'Could better connect theory to practical applications',
        'More structured approach to difficult topics needed',
        'Could improve PowerPoint presentation design',
        'Would benefit from more interactive activities',
        'Could provide additional reading materials'
    ];
    
    additional_comments := ARRAY[
        'Overall a good learning experience',
        'Would recommend this course to other students',
        'Appreciate the effort put into teaching',
        'Course content is relevant and up-to-date',
        'Good balance between theory and practice',
        'Helpful in building foundational knowledge',
        'Course objectives were clearly communicated',
        'Assessment methods were appropriate',
        'Learning outcomes were achieved',
        'Course contributed to my academic growth',
        'Would take another course with this instructor',
        'Course materials were well-selected'
    ];
    
    -- Loop through lecturers who have course offerings but no feedback
    FOR lecturer_offering_record IN 
        SELECT DISTINCT co.id as offering_id, co.lecturer_id, l.first_name, l.last_name
        FROM course_offerings co
        JOIN lecturers l ON co.lecturer_id = l.id
        WHERE l.is_active = true
        AND co.id NOT IN (SELECT DISTINCT course_offering_id FROM feedback)
    LOOP
        RAISE NOTICE 'Adding feedback for lecturer: % % (Offering ID: %)', 
            lecturer_offering_record.first_name, 
            lecturer_offering_record.last_name, 
            lecturer_offering_record.offering_id;
        
        -- Generate 20-25 feedback entries per lecturer
        feedback_count := FLOOR(RANDOM() * 6 + 20)::INTEGER; -- 20-25 feedback entries
        
        FOR i IN 1..feedback_count LOOP
            -- Generate weighted random rating (more likely to be 3-5)
            rating := CASE 
                WHEN RANDOM() < 0.05 THEN 1  -- 5% chance of 1
                WHEN RANDOM() < 0.15 THEN 2  -- 10% chance of 2  
                WHEN RANDOM() < 0.35 THEN 3  -- 20% chance of 3
                WHEN RANDOM() < 0.70 THEN 4  -- 35% chance of 4
                ELSE 5                       -- 30% chance of 5
            END;
            
            -- Generate random date between Jan 2025 and May 2025
            feedback_date := '2025-01-01'::DATE + (RANDOM() * 120)::INTEGER * INTERVAL '1 day';
            
            -- Select random comments
            selected_positive := positive_comments[FLOOR(RANDOM() * array_length(positive_comments, 1) + 1)];
            selected_improvement := improvement_comments[FLOOR(RANDOM() * array_length(improvement_comments, 1) + 1)];
            selected_additional := additional_comments[FLOOR(RANDOM() * array_length(additional_comments, 1) + 1)];
            
            -- Insert feedback record (removed submission_method column)
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
                is_anonymous,
                created_at
            ) VALUES (
                lecturer_offering_record.offering_id,
                1, -- Course Evaluation category
                1, -- Pending status
                rating,
                LEAST(5, GREATEST(1, rating + FLOOR(RANDOM() * 3 - 1)::INTEGER)), -- Slight variation, capped at 5
                LEAST(5, GREATEST(1, rating + FLOOR(RANDOM() * 3 - 1)::INTEGER)), -- Slight variation, capped at 5
                LEAST(5, GREATEST(1, rating + FLOOR(RANDOM() * 3 - 1)::INTEGER)), -- Slight variation, capped at 5
                LEAST(5, GREATEST(1, rating + FLOOR(RANDOM() * 3 - 1)::INTEGER)), -- Slight variation, capped at 5
                CASE WHEN rating >= 3 THEN selected_positive ELSE NULL END,
                CASE WHEN rating <= 4 THEN selected_improvement ELSE NULL END,
                selected_additional,
                true,
                feedback_date
            );
        END LOOP;
        
        RAISE NOTICE 'Added % feedback entries for offering %', feedback_count, lecturer_offering_record.offering_id;
    END LOOP;
    
    RAISE NOTICE 'Feedback population completed successfully';
END $$;

-- Verify the results
SELECT 
    'Lecturers without course offerings' as metric,
    COUNT(*) as count
FROM lecturers l
WHERE l.is_active = true
AND l.id NOT IN (SELECT DISTINCT lecturer_id FROM course_offerings)

UNION ALL

SELECT 
    'Lecturers without feedback' as metric,
    COUNT(*) as count  
FROM lecturers l
WHERE l.is_active = true
AND l.id NOT IN (
    SELECT DISTINCT co.lecturer_id 
    FROM course_offerings co 
    JOIN feedback f ON co.id = f.course_offering_id
);
