\echo 'Delete and recreate wonder_journal db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE wonder_journal;
CREATE DATABASE wonder_journal;
\connect wonder_journal

\i wonder_journal-schema.sql
\i wonder_journal-seed.sql

\echo 'Delete and recreate wonder_journal_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE wonder_journal_test;
CREATE DATABASE wonder_journal_test;
\connect wonder_journal_test

\i wonder_journal-schema.sql
