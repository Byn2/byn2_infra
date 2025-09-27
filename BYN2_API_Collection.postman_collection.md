{
	"info": {
		"_postman_id": "byn2-api-collection",
		"name": "BYN2 API Collection",
		"description": "Complete API collection for BYN2 application covering Auth, Wallet, User, and Monime endpoints",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
	},
	"item": [
		{
			"name": "Authentication",
			"item": [
				{
					"name": "OTP Login",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "x-platform",
								"value": "mobile",
								"description": "Optional: Set to 'mobile' for mobile platform"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n  \"platform\": \"web\",\n  \"phone\": \"+1234567890\",\n  \"otp\": \"123456\"\n}"
						},
						"url": {
							"raw": "{{base_url}}/api/v1/auth/otp-login",
							"host": [
								"{{base_url}}"
							],
							"path": [
								"api",
								"v1",
								"auth",
								"otp-login"
							]
						},
						"description": "Authenticate user with OTP. Returns user data and access token for mobile platforms."
					}
				}
			]
		},
		{
			"name": "Wallet",
			"item": [
				{
					"name": "Get Balance",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer {{access_token}}"
							}
						],
						"url": {
							"raw": "{{base_url}}/api/v1/wallet/balance",
							"host": [
								"{{base_url}}"
							],
							"path": [
								"api",
								"v1",
								"wallet",
								"balance"
							]
						},
						"description": "Get user wallet balance in USDC and fiat currency"
					}
				},
				{
					"name": "Transfer to User",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "Authorization",
								"value": "Bearer {{access_token}}"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n  \"recipient\": \"user_tag_or_id\",\n  \"amount\": 100.50,\n  \"description\": \"Payment for services\"\n}"
						},
						"url": {
							"raw": "{{base_url}}/api/v1/wallet/transfer",
							"host": [
								"{{base_url}}"
							],
							"path": [
								"api",
								"v1",
								"wallet",
								"transfer"
							]
						},
						"description": "Transfer funds to another user"
					}
				},
				{
					"name": "Transfer to Public Key",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "Authorization",
								"value": "Bearer {{access_token}}"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n  \"publicKey\": \"solana_public_key_here\",\n  \"amount\": 50.25,\n  \"description\": \"External transfer\"\n}"
						},
						"url": {
							"raw": "{{base_url}}/api/v1/wallet/transfer-pubkey",
							"host": [
								"{{base_url}}"
							],
							"path": [
								"api",
								"v1",
								"wallet",
								"transfer-pubkey"
							]
						},
						"description": "Transfer funds to a Solana public key"
					}
				}
			]
		},
		{
			"name": "User",
			"item": [
				{
					"name": "Get User Profile",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer {{access_token}}"
							}
						],
						"url": {
							"raw": "{{base_url}}/api/v1/user/get-user",
							"host": [
								"{{base_url}}"
							],
							"path": [
								"api",
								"v1",
								"user",
								"get-user"
							]
						},
						"description": "Get current user profile information"
					}
				},
				{
					"name": "Update User Profile",
					"request": {
						"method": "PUT",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "Authorization",
								"value": "Bearer {{access_token}}"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n  \"firstName\": \"John\",\n  \"lastName\": \"Doe\",\n  \"email\": \"john.doe@example.com\",\n  \"phone\": \"+1234567890\"\n}"
						},
						"url": {
							"raw": "{{base_url}}/api/v1/user/update",
							"host": [
								"{{base_url}}"
							],
							"path": [
								"api",
								"v1",
								"user",
								"update"
							]
						},
						"description": "Update user profile information"
					}
				},
				{
					"name": "Search Users",
					"request": {
						"method": "GET",
						"header": [
							{
								"key": "Authorization",
								"value": "Bearer {{access_token}}"
							}
						],
						"url": {
							"raw": "{{base_url}}/api/v1/user/search?term=john&limit=10",
							"host": [
								"{{base_url}}"
							],
							"path": [
								"api",
								"v1",
								"user",
								"search"
							],
							"query": [
								{
									"key": "term",
									"value": "john",
									"description": "Search term for finding users"
								},
								{
									"key": "limit",
									"value": "10",
									"description": "Maximum number of results (default: 10)"
								}
							]
						},
						"description": "Search for users by name, email, or tag"
					}
				}
			]
		},
		{
			"name": "Monime",
			"item": [
				{
					"name": "Create Payment (Deposit)",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "Authorization",
								"value": "Bearer {{access_token}}"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n  \"amount\": 1000,\n  \"currency\": \"XOF\",\n  \"phone\": \"+22670123456\"\n}"
						},
						"url": {
							"raw": "{{base_url}}/api/v1/monime/deposit/create-payment",
							"host": [
								"{{base_url}}"
							],
							"path": [
								"api",
								"v1",
								"monime",
								"deposit",
								"create-payment"
							]
						},
						"description": "Create a payment for deposit via Monime"
					}
				},
				{
					"name": "Generate USSD Code",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "Authorization",
								"value": "Bearer {{access_token}}"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n  \"amount\": 500,\n  \"phone\": \"+22670123456\",\n  \"operator\": \"orange\"\n}"
						},
						"url": {
							"raw": "{{base_url}}/api/v1/monime/deposit/generate-ussd",
							"host": [
								"{{base_url}}"
							],
							"path": [
								"api",
								"v1",
								"monime",
								"deposit",
								"generate-ussd"
							]
						},
						"description": "Generate USSD code for mobile money deposit"
					}
				},
				{
					"name": "Withdraw",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "Authorization",
								"value": "Bearer {{access_token}}"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n  \"amount\": 750,\n  \"phone\": \"+22670123456\",\n  \"operator\": \"mtn\"\n}"
						},
						"url": {
							"raw": "{{base_url}}/api/v1/monime/withdraw",
							"host": [
								"{{base_url}}"
							],
							"path": [
								"api",
								"v1",
								"monime",
								"withdraw"
							]
						},
						"description": "Withdraw funds to mobile money account"
					}
				},
				{
					"name": "KYC Verify",
					"request": {
						"method": "POST",
						"header": [
							{
								"key": "Content-Type",
								"value": "application/json"
							},
							{
								"key": "Authorization",
								"value": "Bearer {{access_token}}"
							}
						],
						"body": {
							"mode": "raw",
							"raw": "{\n  \"number\": \"+22670123456\"\n}"
						},
						"url": {
							"raw": "{{base_url}}/api/v1/monime/kyc-verify",
							"host": [
								"{{base_url}}"
							],
							"path": [
								"api",
								"v1",
								"monime",
								"kyc-verify"
							]
						},
						"description": "Verify KYC information (currently disabled in implementation)"
					}
				}
			]
		}
	],
	"variable": [
		{
			"key": "base_url",
			"value": "http://localhost:3000",
			"description": "Base URL for the API. Change to your production URL when needed."
		},
		{
			"key": "access_token",
			"value": "",
			"description": "JWT access token obtained from login. Set this after successful authentication."
		}
	]
}