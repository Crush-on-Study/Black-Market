# Requirements Document

## Introduction

This feature implements a mock data integration system for the Black Market application. The system will convert existing frontend mock data (JavaScript objects) into JSON format, store them in the backend directory, and provide a configurable mechanism to load this mock data into the database during development and testing phases. This will enable developers to quickly populate the database with realistic test data without manual data entry.

## Requirements

### Requirement 1

**User Story:** As a developer, I want to convert frontend mock data to backend JSON files, so that I can use consistent test data across frontend and backend systems.

#### Acceptance Criteria

1. WHEN the system processes frontend mock data THEN it SHALL create corresponding JSON files in the BackEnd directory
2. WHEN converting achievements.js data THEN the system SHALL create achievements.json with all achievement and badge data
3. WHEN converting mockData.js data THEN the system SHALL create separate JSON files for deals, price data, and recent trades
4. WHEN creating JSON files THEN the system SHALL maintain the original data structure and relationships
5. WHEN generating JSON files THEN the system SHALL ensure valid JSON format with proper encoding

### Requirement 2

**User Story:** As a developer, I want to configure mock data loading through environment variables, so that I can easily enable or disable mock data in different environments.

#### Acceptance Criteria

1. WHEN the .env file contains MOCK_DATA=true THEN the system SHALL load mock data into the database
2. WHEN the .env file contains MOCK_DATA=false THEN the system SHALL skip mock data loading
3. WHEN MOCK_DATA parameter is not specified THEN the system SHALL default to false (no mock data loading)
4. WHEN the environment variable is updated THEN the system SHALL respect the new setting on next database initialization
5. WHEN mock data loading is enabled THEN the system SHALL log the loading process for debugging

### Requirement 3

**User Story:** As a developer, I want the database initialization to automatically load mock data when enabled, so that I can have a populated database for development and testing.

#### Acceptance Criteria

1. WHEN database tables are created AND MOCK_DATA=true THEN the system SHALL automatically load all mock data
2. WHEN loading mock data THEN the system SHALL populate users, achievements, listings, and trades tables
3. WHEN loading mock data THEN the system SHALL handle data dependencies correctly (users before listings, etc.)
4. WHEN mock data already exists THEN the system SHALL skip duplicate entries or update existing ones
5. WHEN mock data loading fails THEN the system SHALL log errors and continue with database initialization
6. WHEN loading achievements THEN the system SHALL create both achievement definitions and user achievement relationships

### Requirement 4

**User Story:** As a developer, I want comprehensive documentation of the mock data system, so that I can understand how to use and maintain the feature.

#### Acceptance Criteria

1. WHEN documentation is created THEN it SHALL explain the purpose and benefits of the mock data system
2. WHEN documentation is provided THEN it SHALL include step-by-step setup instructions
3. WHEN documentation is written THEN it SHALL describe all environment variables and their effects
4. WHEN documentation is complete THEN it SHALL include examples of enabling/disabling mock data
5. WHEN documentation is finished THEN it SHALL explain the JSON file structure and location
6. WHEN documentation is created THEN it SHALL include troubleshooting information for common issues