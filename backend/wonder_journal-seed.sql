-- both test users have the password "password"

INSERT INTO users (username, password, first_name, last_name, email)
VALUES ('testuser',
        '$2b$12$empoxX.a1kmdtdSpDlxFy.2k8RROm7ziPioKCrw4mnvP0Xt0li2.i',
        'Test',
        'User',
        'testuser@test.com')
