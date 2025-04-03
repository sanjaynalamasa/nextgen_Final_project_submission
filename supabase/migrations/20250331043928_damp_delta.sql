/*
  # Add delete policies for profiles and auctions tables

  1. Changes
    - Add DELETE policy for profiles table
    - Add DELETE policy for auctions table
    - Ensure only authenticated users can delete their own data

  2. Security
    - Users can only delete their own profile
    - Users can only delete their own auctions
    - Maintain existing RLS policies
*/

-- Add delete policy for profiles table
CREATE POLICY "Users can delete their own profile"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Add delete policy for auctions table
CREATE POLICY "Users can delete their own auctions"
  ON auctions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);