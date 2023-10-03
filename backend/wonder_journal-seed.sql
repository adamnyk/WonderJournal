-- both test users have the password "password"

INSERT INTO users (username, password, first_name, last_name, email)
VALUES ('testuser',
        '$2b$12$empoxX.a1kmdtdSpDlxFy.2k8RROm7ziPioKCrw4mnvP0Xt0li2.i',
        'Test',
        'User',
        'testuser@test.com');


-- Create moments
INSERT INTO moments (id, title, text, date, username)
VALUES ('2',
        'First Moment',
        'Enjoying creating and playing with this app! Many problems to solve, designs to consider, and things to be built. Enjoying the process and the challenge :) ',
        '2023-09-15',
        'testuser');

INSERT INTO moments (id, title, text, date, username)
VALUES ('3',
        'Bike rides in the sunshine',
        'What a joy to swoop around town on the bike this clear and crisp Autumn day! Beautiful views of the rim, red rock glowing in the sunshine, and the last blooms of sun and moonflower decorating the roadside. Blessed to live in such an amazing community and to be able to enjoy in the nature right outside my door.',
        '2023-10-01',
        'testuser');



-- Create moment_media and associate with moments
INSERT INTO moment_media ( url, type, moment_id)
VALUES ('https://wonder-journal.s3.us-west-2.amazonaws.com/testuser/2/0_GD_XmCiR-l1cPrzh.png',
'image',
'2'
);

INSERT INTO moment_media ( url, type, moment_id)
VALUES ('https://wonder-journal.s3.us-west-2.amazonaws.com/testuser/3/static.onecms.io__wp-content__uploads__sites__37__2020__02__evening-fragrance-moonflower-a0b55857-7e3ef1f2f8654eca927fd3d70f95f8ea.webp',
'image',
'3'
);


-- Create user tags
INSERT INTO tags ( id, name, username)
VALUES ('1',
'nature',
'testuser'
);

INSERT INTO tags ( id, name, username)
VALUES ('2',
'play',
'testuser'
);

INSERT INTO tags ( id, name, username)
VALUES ('3',
'friends',
'testuser'
);

INSERT INTO tags ( id, name, username)
VALUES ('4',
'learning',
'testuser'
);




-- Tag moments
INSERT INTO moments_tags ( tag_id, moment_id)
VALUES ('4',
'2'
);
INSERT INTO moments_tags ( tag_id, moment_id)
VALUES ('2',
'2'
);

INSERT INTO moments_tags ( tag_id, moment_id)
VALUES ('1',
'3'
);
INSERT INTO moments_tags ( tag_id, moment_id)
VALUES ('2',
'3'
);