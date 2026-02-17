-- Migration: Add feedback column to grades table
-- Date: 2026-02-17
-- Description: Adds an optional feedback column to the grades table to allow teachers to provide textual feedback on student grades

ALTER TABLE grades ADD COLUMN feedback TEXT NULL;
