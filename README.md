# E-Auction-System

A full-stack online auction platform built with a Django REST API backend and a Next.js frontend.

## Overview

This project provides a complete auction experience where users can:

- register and manage their accounts
- log in securely using JWT authentication
- create and manage auction listings
- place bids on active auctions
- track auction status and updates
- interact with a modern responsive frontend

## Tech Stack

### Backend
- Python
- Django
- Django REST Framework
- JWT authentication
- SQLite database

### Frontend
- Next.js
- React
- JavaScript
- Tailwind CSS

## Repository Structure

```text
E-Auction-System/
├── backend/
│   ├── accounts/
│   ├── auctions/
│   ├── config/
│   ├── manage.py
│   ├── requirements.txt
│   └── run_auction_scheduler.bat
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   ├── next.config.mjs
│   └── postcss.config.mjs
├── .gitignore
└── README.md
```

## Features

- User authentication and authorization
- Role-aware access for auction operations
- Auction creation, bidding, and status management
- REST APIs for frontend integration
- CORS-enabled backend for local frontend development
- Scalable app structure for extending functionality

## Project Notes

- The backend uses Django with custom user models and JWT-based authentication.
- The frontend is built with Next.js and is intended to interact with the Django API.
- The system is structured as a modular app with separate `accounts` and `auctions` domains.

## Contribution

Contributions are welcome. If you want to improve the platform:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request
