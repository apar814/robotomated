-- User saved/bookmarked robots
CREATE TABLE user_saved_robots (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  robot_id    UUID NOT NULL REFERENCES robots(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, robot_id)
);

CREATE INDEX idx_saved_robots_user ON user_saved_robots(user_id);
CREATE INDEX idx_saved_robots_robot ON user_saved_robots(robot_id);

ALTER TABLE user_saved_robots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own saved robots"
  ON user_saved_robots FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can save robots"
  ON user_saved_robots FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unsave robots"
  ON user_saved_robots FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
