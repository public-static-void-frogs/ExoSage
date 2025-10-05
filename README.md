# NASA space app challenge 2025
This repository contains solution developed for NASA space app challenge 2025 ['A World Away: Hunting for Exoplanets with AI'](https://www.spaceappschallenge.org/2025/challenges/a-world-away-hunting-for-exoplanets-with-ai/).

So as to address the challenge we developed an ml-powered web application. We trained a TCN model on data from NASA's exoplanets archive. The model's inferense was developed as a part of the back-end using FastAPI and PyTorch. The front-end part of the application was developed on React. More information about the project and research can be found on [NASA space app website](https://www.spaceappschallenge.org/2025/find-a-team/spaceworms2/?tab=project).

# Project structure
### data pipelines
- this module contains pipelines used for data collection and filtration.
### ml
- this module contains code used for model training along with model architescture.
### web_app
- **back_end:** this module contains code used for inference and back-end part.
- **front_end:** this module contains code of front-end part of the application.

# Team SpaceWorms
- Ivanna Trofymenko
- Bohdan Boklah
- Kateryna Prylutska
- Denys Stepchyn
- Oleh Zapara
- Volodymyr Shargorodskyy
