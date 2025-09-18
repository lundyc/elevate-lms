-- Users table: accounts for all roles
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  role ENUM('sysadmin','group_admin','admin','player') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Groups (clubs) table
CREATE TABLE groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sport_type VARCHAR(100) NOT NULL,
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Teams within groups
CREATE TABLE teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  group_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- Assignment of admins to teams
CREATE TABLE user_team_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  team_id INT NOT NULL,
  role ENUM('admin') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

-- Themes table
CREATE TABLE themes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  primary_color VARCHAR(10),
  secondary_color VARCHAR(10),
  accent_color VARCHAR(10),
  text_color VARCHAR(10),
  logo_path VARCHAR(255),
  icon VARCHAR(10),
  custom_logo_path VARCHAR(255) NULL
);

-- System settings (key/value pairs)
CREATE TABLE system_settings (
  key_name VARCHAR(100) PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Games table (LMS competitions)
CREATE TABLE games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  team_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  start_week INT NOT NULL,
  registration_deadline DATETIME,
  entry_fee DECIMAL(10,2) NOT NULL,
  prize_percentage DECIMAL(5,2) NOT NULL,
  test_mode_override TINYINT(1) DEFAULT NULL,
  buyback_week INT DEFAULT 1,
  rollover_from INT DEFAULT NULL,
  rollover_amount DECIMAL(10,2) DEFAULT 0,
  prize_fund DECIMAL(10,2) DEFAULT 0,
  club_share DECIMAL(10,2) DEFAULT 0,
  platform_fee DECIMAL(10,2) DEFAULT 0,
  status ENUM('pending','active','ended','ended_no_winner') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (rollover_from) REFERENCES games(id)
);

-- Players in a game
CREATE TABLE players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  game_id INT NOT NULL,
  paid TINYINT(1) DEFAULT 0,
  eliminated TINYINT(1) DEFAULT 0,
  elimination_week INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_player_game (user_id, game_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- Payments: entry fees and buy backs
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  game_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'GBP',
  paid TINYINT(1) DEFAULT 0,
  payment_method VARCHAR(50),
  is_test TINYINT(1) DEFAULT 0,
  type ENUM('entry','buyback') DEFAULT 'entry',
  stripe_charge_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (game_id) REFERENCES games(id)
);

-- Picks: weekly team selections by players
CREATE TABLE picks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_id INT NOT NULL,
  game_id INT NOT NULL,
  week_number INT NOT NULL,
  team_id INT NOT NULL,
  auto_assigned TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_player_week (player_id, game_id, week_number),
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- Fixtures & results
CREATE TABLE fixtures (
  id INT AUTO_INCREMENT PRIMARY KEY,
  external_id INT,
  match_date DATETIME,
  home_team VARCHAR(100),
  away_team VARCHAR(100),
  week_number INT,
  status ENUM('scheduled','finished','cancelled','postponed') DEFAULT 'scheduled',
  result VARCHAR(10) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Logs for scheduled jobs
CREATE TABLE job_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_name VARCHAR(50) NOT NULL,
  status ENUM('success','failed') NOT NULL,
  message TEXT,
  run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- General audit log
CREATE TABLE audit_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  event_type VARCHAR(100),
  action VARCHAR(100),
  details TEXT,
  ip_address VARCHAR(50),
  user_agent VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payouts to clubs
CREATE TABLE payouts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  game_id INT NOT NULL,
  club_id INT NOT NULL,
  prize_fund DECIMAL(10,2) NOT NULL,
  club_share DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  status ENUM('pending','paid') DEFAULT 'pending',
  paid_at TIMESTAMP NULL,
  paid_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES games(id),
  FOREIGN KEY (club_id) REFERENCES groups(id),
  FOREIGN KEY (paid_by) REFERENCES users(id)
);

-- Hall of Fame: top wins
CREATE TABLE hall_of_fame (
  id INT AUTO_INCREMENT PRIMARY KEY,
  game_id INT NOT NULL,
  club_id INT NOT NULL,
  winner_id INT NOT NULL,
  prize_amount DECIMAL(10,2) NOT NULL,
  pot_total DECIMAL(10,2) NOT NULL,
  ended_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (game_id) REFERENCES games(id),
  FOREIGN KEY (club_id) REFERENCES groups(id),
  FOREIGN KEY (winner_id) REFERENCES users(id)
);

-- Rollovers history
CREATE TABLE rollovers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  from_game_id INT,
  to_game_id INT,
  amount DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  FOREIGN KEY (from_game_id) REFERENCES games(id),
  FOREIGN KEY (to_game_id) REFERENCES games(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Seed system settings
INSERT INTO system_settings (key_name, value) VALUES
  ('payments_test_mode', 'true'),
  ('platform_fee_percentage', '10'),
  ('installer_complete', 'false'),
  ('active_theme', '1');

-- Seed sysadmin user (password hash placeholder)
INSERT INTO users (email, name, password_hash, role) VALUES
  ('colin@lundy.me.uk', 'Sys Admin', '$2y$10$hashhashhash', 'sysadmin');
