<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h1 align="center">Fruitify</h1>
  <p align="center">
    A simple Angular application for searching and visualizing fruit nutrition information.
    <br />
    <a href="https://github.com/mancarius/fruitify2/issues">Report a Bug</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

![Product Screenshot][product-screenshot]

This application allows users to search for fruits by name, order, family, or genus, and learn more about their nutritional values.

Fruit images are sourced from two online photo services: [Unsplash](https://www.unsplash.com/) and [Pexels](https://www.pexels.com/).

The project includes a Node.js backup server providing mocked APIs for the application. (The original online API was discontinued during development.) However, the server is not the core focus of this project.

### Built With

This section lists the primary frameworks and tools used to build the project. Plugins and additional tools are mentioned in the acknowledgements. Key technologies include:

* [Angular](https://v18.angular.dev)
* [Angular Material](https://v18.material.angular.io)
* [NgRx](https://ngrx.io)
* [TailwindCSS](https://tailwindcss.com)

<!-- GETTING STARTED -->
## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

This project requires Node.js (v19 or higher) and a package manager. While the examples below use NPM, you may use any package manager you prefer.

### Installation

1. Obtain free API keys at:
   * [Unsplash](https://unsplash.com/developers)
   * [Pexels](https://www.pexels.com/api/)

2. Clone the repository:
   ```sh
   git clone https://github.com/mancarius/fruitify2.git
3. Install API server dependencies:
   ```sh
   cd api
   npm install
   ```
4. Create a .env file in the API directory and add your API keys:
   ```ini
   NODE_ENV=development
   PEXELS_API_KEY=<la-tua-pexels-api-key>
   UNSPLASH_API_KEY=<la-tua-unsplash-api-key>
   ```
5. Install client dependencies:
   ```sh
   cd ../client
   npm install
   ```

## Development mode

To run the application in development mode:

1. Start the API server:
   ```sh
   cd /api
   npm run start:dev
   ```
2. Start the client:
   ```sh
   cd ../client
   npm run dev
   ```
Access the application at `http://localhost:4200`

## Production-Like mode

<div style="background-color:#111; border-left: 4px solid orange">
  <h4 style="color:gray;padding:10px; padding-bottom:0">Important</h4>
  <p style="padding:10px; padding-top:0">
  You must have a container management tool (e.g., <a href="https://www.docker.com">Docker</a> or <a href="https://podman.io/">Podman</a>) installed on your machine to run this command.
  </p>
</div>

Run the application in production mode using Docker:

  ```sh
  docker-compose -f docker-compose.prod.yml up --build
  ```

Access the application at `http://localhost`

<!-- CONTRIBUTING -->
## Contributing

Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.


<!-- CONTACT -->
## Contact

Mattia Mancarella - [LinkedIn](https://www.linkedin.com/in/mattia-mancarella/) - hello@mattiamancarella.com

Project Link: [https://github.com/mancarius/fruitify2](https://github.com/mancarius/fruitify2)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements

* [Font Awesome](https://fontawesome.com)
* [NestJS](https://nestjs.com)
* [Docker](https://www.docker.com)
* [Unsplash](https://unsplash.com/)
* [Pexels](https://www.pexels.com/)





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/mancarius/fruitify2.svg?style=for-the-badge
[contributors-url]: https://github.com/mancarius/fruitify2/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/mancarius/fruitify2?style=for-the-badge
[forks-url]: https://github.com/mancarius/fruitify2/network/members
[stars-shield]: https://img.shields.io/github/stars/mancarius/fruitify.svg?style=for-the-badge
[stars-url]: https://github.com/mancarius/fruitify/stargazers
[issues-shield]: https://img.shields.io/github/issues/mancarius/fruitify2.svg?style=for-the-badge
[issues-url]: https://github.com/mancarius/fruitify2/issues
[license-shield]: https://img.shields.io/github/license/mancarius/fruitify2.svg?style=for-the-badge
[license-url]: https://github.com/othneildrew/Best-README-Template/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/mattia-mancarella
[product-screenshot]: ./screenshot.jpg
