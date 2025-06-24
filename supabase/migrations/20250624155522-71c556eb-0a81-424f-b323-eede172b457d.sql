
-- First, let's check what course offerings we actually have and add feedback accordingly
-- Adding 150+ realistic feedback entries with proper course offering validation

-- Add feedback for CSE101 offerings (current semester - Fall 2024-2025)
INSERT INTO feedback (course_offering_id, category_id, status_id, overall_rating, teaching_effectiveness, course_content, communication, availability, positive_feedback, improvement_suggestions, additional_comments)
SELECT 
    co.id,
    1,
    1,
    unnest(ARRAY[5, 4, 3, 4, 5, 3, 4, 5, 2, 4]),
    unnest(ARRAY[5, 4, 3, 4, 5, 3, 4, 5, 2, 4]),
    unnest(ARRAY[4, 5, 4, 4, 5, 3, 4, 5, 3, 4]),
    unnest(ARRAY[5, 4, 3, 4, 5, 2, 4, 5, 2, 4]),
    unnest(ARRAY[4, 3, 2, 4, 4, 2, 3, 4, 1, 3]),
    unnest(ARRAY[
        'Excellent introduction to programming with clear examples.',
        'Good course structure and logical progression.',
        'Content is okay but delivery needs improvement.',
        'Well-structured with practical programming examples.',
        'Outstanding teacher! Makes coding fun and accessible.',
        'Basic programming concepts covered but pace too fast.',
        'Good foundation for computer science studies.',
        'Inspiring introduction that motivated me to learn more.',
        'Very difficult to follow and understand.',
        'Solid programming fundamentals with good support.'
    ]),
    unnest(ARRAY[
        'More practice problems and coding exercises.',
        'Need more lab time for hands-on practice.',
        'Speak louder and slower during lectures.',
        'More real-world programming projects.',
        'Keep doing exactly what you are doing.',
        'Slow down pace and provide more examples.',
        'More debugging techniques coverage.',
        'Continue with current excellent approach.',
        'Need complete restructure of teaching method.',
        'More interactive coding sessions would help.'
    ]),
    unnest(ARRAY[
        'Really enjoyed learning Python basics.',
        'Assignments were challenging but fair.',
        'Hard to follow sometimes during class.',
        'Good foundation for future CS courses.',
        'Best intro programming course ever taken.',
        'Struggling with advanced concepts.',
        'Great start to computer science journey.',
        'Inspired me to pursue CS further.',
        'Considering dropping this course.',
        'Building confidence in programming.'
    ])
FROM course_offerings co
JOIN courses c ON co.course_id = c.id
WHERE c.course_code = 'CSE101' AND co.semester_id = 4;

-- Add feedback for CSE201 offerings
INSERT INTO feedback (course_offering_id, category_id, status_id, overall_rating, teaching_effectiveness, course_content, communication, availability, positive_feedback, improvement_suggestions, additional_comments)
SELECT 
    co.id,
    unnest(ARRAY[1, 1, 2, 1, 1, 3, 1, 2]),
    unnest(ARRAY[1, 1, 1, 1, 1, 1, 1, 1]),
    unnest(ARRAY[4, 5, 4, 3, 5, 4, 4, 3]),
    unnest(ARRAY[4, 5, 4, 3, 5, 4, 4, 3]),
    unnest(ARRAY[5, 4, 4, 4, 5, 5, 4, 4]),
    unnest(ARRAY[4, 5, 4, 3, 5, 4, 4, 3]),
    unnest(ARRAY[4, 4, 3, 2, 5, 3, 4, 2]),
    unnest(ARRAY[
        'Very comprehensive coverage of data structures.',
        'Prof. Davis is amazing! Always available to help.',
        'Good algorithms coverage with practical examples.',
        'Content is good but pace could be slower.',
        'Outstanding course design and delivery.',
        'OOP concepts are well structured and logical.',
        'Solid theoretical foundation in algorithms.',
        'Basic coverage but needs more depth.'
    ]),
    unnest(ARRAY[
        'More coding practice sessions needed.',
        'Course is perfect as designed.',
        'More time for difficult topics.',
        'Need more worked examples in class.',
        'Nothing to improve - excellent course.',
        'More real-world project examples.',
        'More practice with complex problems.',
        'More interactive problem-solving sessions.'
    ]),
    unnest(ARRAY[
        'Challenging but rewarding course.',
        'Best course this semester so far.',
        'Solid theoretical foundation provided.',
        'Need more support for complex topics.',
        'Highly engaging and well-structured.',
        'Design patterns are fascinating to learn.',
        'Great preparation for advanced CS.',
        'Could be more engaging overall.'
    ])
FROM course_offerings co
JOIN courses c ON co.course_id = c.id
WHERE c.course_code = 'CSE201' AND co.semester_id = 4;

-- Add feedback for EEE101 offerings
INSERT INTO feedback (course_offering_id, category_id, status_id, overall_rating, teaching_effectiveness, course_content, communication, availability, positive_feedback, improvement_suggestions, additional_comments)
SELECT 
    co.id,
    unnest(ARRAY[1, 1, 1, 1, 2, 3, 1, 4]),
    unnest(ARRAY[1, 1, 1, 1, 1, 1, 1, 1]),
    unnest(ARRAY[4, 5, 3, 4, 4, 4, 5, 3]),
    unnest(ARRAY[4, 5, 3, 4, 4, 4, 5, 3]),
    unnest(ARRAY[4, 4, 4, 5, 4, 5, 4, 4]),
    unnest(ARRAY[3, 5, 3, 4, 3, 4, 5, 3]),
    unnest(ARRAY[3, 4, 2, 3, 3, 3, 4, 2]),
    unnest(ARRAY[
        'Good foundation in circuit analysis.',
        'Excellent introduction to EE concepts.',
        'Content is relevant but delivery could improve.',
        'Strong theoretical background provided.',
        'Good introduction to electrical concepts.',
        'Course content is comprehensive and organized.',
        'Very knowledgeable and helpful professor.',
        'Basic electrical concepts covered adequately.'
    ]),
    unnest(ARRAY[
        'More lab time for hands-on practice.',
        'Continue current teaching methods.',
        'Use more visual aids and examples.',
        'More industry case studies would help.',
        'More circuit simulation exercises needed.',
        'More current industry applications.',
        'Continue with excellent approach.',
        'More practical circuit building exercises.'
    ]),
    unnest(ARRAY[
        'Solid course with room for improvement.',
        'Very clear explanations of complex topics.',
        'Some topics need better explanation.',
        'Challenging but rewarding course.',
        'Lab equipment could be updated.',
        'Good foundation for electrical engineering.',
        'Excellent balance of theory and practice.',
        'Theory is solid but needs more hands-on.'
    ])
FROM course_offerings co
JOIN courses c ON co.course_id = c.id
WHERE c.course_code = 'EEE101' AND co.semester_id = 4;

-- Add feedback for MATH101 offerings
INSERT INTO feedback (course_offering_id, category_id, status_id, overall_rating, teaching_effectiveness, course_content, communication, availability, positive_feedback, improvement_suggestions, additional_comments)
SELECT 
    co.id,
    unnest(ARRAY[1, 1, 1, 1, 5, 6, 1, 4]),
    unnest(ARRAY[1, 1, 1, 1, 1, 1, 1, 1]),
    unnest(ARRAY[4, 5, 3, 4, 5, 4, 2, 4]),
    unnest(ARRAY[4, 5, 3, 4, 5, 4, 1, 4]),
    unnest(ARRAY[5, 5, 4, 4, 4, 3, 2, 4]),
    unnest(ARRAY[4, 5, 3, 4, 5, 5, 1, 4]),
    unnest(ARRAY[3, 4, 2, 3, 4, 4, 1, 4]),
    unnest(ARRAY[
        'Calculus fundamentals well explained.',
        'Outstanding physics course with excellent lab work.',
        'Math concepts covered but need clearer explanations.',
        'Calculus concepts thoroughly explained.',
        'Excellent classroom environment for learning.',
        'Communication is excellent and patient.',
        'Cannot understand the teaching style at all.',
        'Overall good calculus course with examples.'
    ]),
    unnest(ARRAY[
        'More practice problems in tutorials.',
        'Perfect balance of theory and practice.',
        'Slower pace and more examples needed.',
        'More application examples from engineering.',
        'Continue fostering positive atmosphere.',
        'Keep being so accessible to students.',
        'Complete restructure of approach needed.',
        'More real-world applications of calculus.'
    ]),
    unnest(ARRAY[
        'Challenging but manageable workload.',
        'Makes physics concepts very clear.',
        'Struggling with some advanced topics.',
        'Good mathematical rigor maintained.',
        'Feel motivated to learn mathematics.',
        'Office hours are extremely helpful.',
        'Considering dropping this course.',
        'Good preparation for advanced mathematics.'
    ])
FROM course_offerings co
JOIN courses c ON co.course_id = c.id
WHERE c.course_code = 'MATH101' AND co.semester_id = 4;

-- Add feedback for BUS101 offerings
INSERT INTO feedback (course_offering_id, category_id, status_id, overall_rating, teaching_effectiveness, course_content, communication, availability, positive_feedback, improvement_suggestions, additional_comments)
SELECT 
    co.id,
    unnest(ARRAY[1, 1, 1, 3, 1, 7, 1, 2]),
    unnest(ARRAY[1, 1, 1, 1, 1, 1, 1, 1]),
    unnest(ARRAY[5, 4, 4, 4, 4, 4, 3, 5]),
    unnest(ARRAY[5, 4, 4, 4, 4, 4, 3, 5]),
    unnest(ARRAY[5, 4, 4, 5, 4, 4, 4, 4]),
    unnest(ARRAY[5, 4, 4, 4, 4, 4, 3, 5]),
    unnest(ARRAY[4, 4, 4, 4, 4, 4, 3, 4]),
    unnest(ARRAY[
        'Outstanding business fundamentals course!',
        'Good business concepts with real examples.',
        'Good introduction to business concepts.',
        'Course content is very relevant and up-to-date.',
        'Practical approach to business education.',
        'Good overall business course with insights.',
        'General business course with adequate coverage.',
        'Excellent teaching methods for business.'
    ]),
    unnest(ARRAY[
        'Perfect introduction to business.',
        'More case study discussions.',
        'More case studies from local businesses.',
        'More guest speakers from businesses.',
        'Continue with current curriculum.',
        'More guest speakers from industry.',
        'More interactive business simulations.',
        'Continue with current approach.'
    ]),
    unnest(ARRAY[
        'Highly engaging and practical.',
        'Solid foundation for business studies.',
        'Excellent preparation for advanced courses.',
        'Great foundation for business career.',
        'Good foundation but could be engaging.',
        'Helpful for understanding fundamentals.',
        'Good introduction but more engagement needed.',
        'Great mix of theory and application.'
    ])
FROM course_offerings co
JOIN courses c ON co.course_id = c.id
WHERE c.course_code = 'BUS101' AND co.semester_id = 4;

-- Add more feedback entries for other existing course offerings to reach 150+ total
-- Advanced courses feedback
INSERT INTO feedback (course_offering_id, category_id, status_id, overall_rating, teaching_effectiveness, course_content, communication, availability, positive_feedback, improvement_suggestions, additional_comments)
SELECT 
    co.id,
    (ARRAY[1, 2, 1, 3, 1, 4, 2, 1])[n] as category_id,
    (ARRAY[1, 1, 1, 1, 1, 1, 1, 1])[n] as status_id,
    (ARRAY[5, 4, 5, 4, 4, 3, 5, 4])[n] as overall_rating,
    (ARRAY[5, 4, 5, 4, 4, 3, 5, 4])[n] as teaching_effectiveness,
    (ARRAY[5, 5, 4, 5, 4, 4, 5, 4])[n] as course_content,
    (ARRAY[4, 4, 5, 4, 4, 3, 5, 4])[n] as communication,
    (ARRAY[4, 3, 4, 3, 4, 2, 4, 3])[n] as availability,
    (ARRAY[
        'Excellent algorithms course with practical applications.',
        'Teaching methods very effective for algorithms.',
        'Outstanding course content with cutting-edge topics.',
        'Course content is comprehensive and up-to-date.',
        'Algorithms are challenging but well-structured.',
        'Assessment could be improved with practical components.',
        'Absolutely outstanding algorithms course!',
        'Good coverage of fundamental algorithms.'
    ])[n] as positive_feedback,
    (ARRAY[
        'Continue current approach.',
        'More coding practice in class.',
        'Keep curriculum updated with developments.',
        'Include more recent algorithm applications.',
        'More time for complex problem solving.',
        'Include more hands-on algorithm analysis.',
        'Continue exactly as you are doing.',
        'More real-world algorithm applications.'
    ])[n] as improvement_suggestions,
    (ARRAY[
        'Best advanced CS course so far.',
        'Appreciate step-by-step problem solving.',
        'Excellent preparation for industry and research.',
        'Excellent coverage of power systems.',
        'Preparing well for advanced computer science.',
        'Theory is strong but need more application.',
        'Inspiring teaching makes complex topics accessible.',
        'Solid theoretical foundation provided.'
    ])[n] as additional_comments
FROM course_offerings co
JOIN courses c ON co.course_id = c.id
CROSS JOIN generate_series(1, 8) as n
WHERE c.course_code IN ('CSE301', 'CSE401') AND co.semester_id = 4;

-- Add feedback for EEE advanced courses
INSERT INTO feedback (course_offering_id, category_id, status_id, overall_rating, teaching_effectiveness, course_content, communication, availability, positive_feedback, improvement_suggestions, additional_comments)
SELECT 
    co.id,
    (ARRAY[1, 5, 1, 6, 1, 2, 3, 1])[n] as category_id,
    (ARRAY[1, 1, 1, 1, 1, 1, 1, 1])[n] as status_id,
    (ARRAY[4, 5, 4, 4, 5, 4, 4, 3])[n] as overall_rating,
    (ARRAY[4, 5, 4, 4, 5, 4, 4, 3])[n] as teaching_effectiveness,
    (ARRAY[4, 4, 5, 3, 4, 4, 5, 4])[n] as course_content,
    (ARRAY[4, 5, 4, 5, 5, 4, 4, 3])[n] as communication,
    (ARRAY[3, 5, 3, 4, 4, 3, 3, 2])[n] as availability,
    (ARRAY[
        'Power systems concepts are well explained.',
        'Perfect classroom environment for EE.',
        'Excellent power engineering course.',
        'Great communication and explains clearly.',
        'Very knowledgeable instructor with experience.',
        'Good power systems course with examples.',
        'Course content comprehensive and current.',
        'Basic power concepts covered adequately.'
    ])[n] as positive_feedback,
    (ARRAY[
        'More industry guest lectures.',
        'Continue current supportive teaching style.',
        'Continue current teaching approach.',
        'Continue being patient with complex topics.',
        'Keep sharing industry experience.',
        'More field trip opportunities.',
        'Include more recent power technologies.',
        'More practical power system analysis.'
    ])[n] as improvement_suggestions,
    (ARRAY[
        'Good preparation for power engineering career.',
        'Excellent balance of theory and practical work.',
        'Very knowledgeable and experienced instructor.',
        'Makes electrical engineering accessible.',
        'Industry experience shows in every lecture.',
        'Relevant to current industry needs.',
        'Up-to-date with current power grid tech.',
        'Theory strong but need more application.'
    ])[n] as additional_comments
FROM course_offerings co
JOIN courses c ON co.course_id = c.id
CROSS JOIN generate_series(1, 8) as n
WHERE c.course_code IN ('EEE201', 'EEE301') AND co.semester_id = 4;

-- Add feedback for MATH201 advanced course
INSERT INTO feedback (course_offering_id, category_id, status_id, overall_rating, teaching_effectiveness, course_content, communication, availability, positive_feedback, improvement_suggestions, additional_comments)
SELECT 
    co.id,
    (ARRAY[1, 1, 6, 7, 1, 2, 4, 1])[n] as category_id,
    (ARRAY[1, 1, 1, 1, 1, 1, 1, 1])[n] as status_id,
    (ARRAY[5, 4, 4, 4, 3, 4, 3, 5])[n] as overall_rating,
    (ARRAY[5, 4, 4, 4, 3, 4, 3, 5])[n] as teaching_effectiveness,
    (ARRAY[4, 5, 3, 4, 4, 4, 4, 5])[n] as course_content,
    (ARRAY[5, 4, 5, 4, 3, 4, 2, 5])[n] as communication,
    (ARRAY[4, 3, 4, 4, 2, 3, 2, 4])[n] as availability,
    (ARRAY[
        'Linear algebra is taught exceptionally well.',
        'Linear algebra concepts clearly presented.',
        'Great communication and always available.',
        'Good overall linear algebra course.',
        'Linear algebra concepts covered but unclear.',
        'Good mathematical foundation provided.',
        'Assessment methods too challenging for level.',
        'Outstanding linear algebra instruction.'
    ])[n] as positive_feedback,
    (ARRAY[
        'Perfect course structure.',
        'More applications in engineering contexts.',
        'Continue being patient with questions.',
        'More engineering examples helpful.',
        'More step-by-step solutions in class.',
        'Continue with current approach.',
        'More gradual difficulty progression needed.',
        'Perfect balance of theory and applications.'
    ])[n] as improvement_suggestions,
    (ARRAY[
        'Clear explanations of abstract concepts.',
        'Good mathematical foundation.',
        'Office hours are extremely helpful.',
        'Solid mathematical foundation provided.',
        'Challenging for students new to abstract math.',
        'Well-structured mathematical course.',
        'Need more support for struggling students.',
        'Clear explanations of complex concepts.'
    ])[n] as additional_comments
FROM course_offerings co
JOIN courses c ON co.course_id = c.id
CROSS JOIN generate_series(1, 8) as n
WHERE c.course_code = 'MATH201' AND co.semester_id = 4;
