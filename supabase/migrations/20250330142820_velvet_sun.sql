/*
  # Fix profiles and auctions policies

  1. Changes
    - Add INSERT policy for profiles table
    - Add policy for users to insert their own profile
    - Modify sign-in query to use email instead of roll number

  2. Security
    - Allow new users to create their profile during sign-up
    - Maintain existing RLS policies
*/

-- Add policy to allow users to create their own profile
CREATE POLICY "Users can create their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);