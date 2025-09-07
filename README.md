# face-swap-app
This project provides an API to swap faces in images using an external third-party API. It supports uploading an image, swapping faces with a target image, and returning the swapped image. The project is built using Node.js, Express, and Axios.

---

## Table of Contents
- [Prerequisites](#prerequisites)
- [Setup & Installation](#setup--installation)
- [Running the Project](#running-the-project)

---

## Prerequisites
- Node.js (v14 or higher)
- npm
- Access to the third-party Face Swap API
- Optional: MongoDB Atlas for storing submissions

---

## Setup & Installation

1. Clone this repository:
    git clone <your-repository-url>
2. Install dependencies:
    npm install
3. Create a `.env` file in the root directory with the following variables:
    SEGMIND_API_KEY=your_segmind_api_key_here
    PORT=your_port_number
    MONGODB_URI=your_mongodb_altas_uri
    DB_NAME=your_db_name

---

## Running the Project

Start the development server:
    npm run dev

