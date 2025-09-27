# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Created comprehensive Postman API collection (`BYN2_API_Collection.postman_collection.json`) covering:
  - Authentication endpoints (OTP Login)
  - Wallet endpoints (Balance, Transfer to User, Transfer to Public Key)
  - User endpoints (Get Profile, Update Profile, Search Users)
  - Monime endpoints (Create Payment/Deposit, Generate USSD, Withdraw, KYC Verify)
- Collection includes proper request/response examples and environment variables
- Added base_url and access_token variables for easy environment switching