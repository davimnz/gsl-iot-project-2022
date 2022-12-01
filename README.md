<a name="readme-top"></a>

<br />
<div align="center">
  <h3 align="center">Internet of Things Project</h3>
  <h3 align="center">Global Shared Learning - ITA & TEC</h3>
  <h4 align="center">InterWebbers Team</h4>

</div>

## Students

  - Andrea Samantha Aguilar Ramírez (TEC)
  - Ana Valeria Pérez Pérez (TEC)
  - José Francisco Lara Delgado (TEC)
  - Diego Andrés Figueroa Peart (TEC)
  - Alvaro Tedeschi Neto (ITA)
  - Davi Muniz Vasconcelos (ITA)
  - Gabriel Henrique Gobi (ITA)
  - Thiago Lopes de Araujo (ITA)

## Motivation

Natural disasters happen every year in tropical countries like Brazil and Mexico. In these situations, it is hard to seek for victims, since the terrain becomes difficult to seek (e.g., covered with mud in a flood or with rubble in a earthquake), and no internet connectivity is present. Therefore, we aim to develop a reliable computational infrastructure to help the victims of natural disasters, so they can inform its situation and position through a mobile application.

## About The Project

This project consists in, during a natural disaster and through a mobile application, provide the users with an interface in which they provide their location, the level of danger their on as a basic text message. Through an MQQT client connected in a drone, for example, the data will be sent through several of these drones, redirecting the signal of each person to the local Crisis Management Center. This data (once processed and aggregated to a database) will be displayed in a dashboard in which the operators of the Crisis Manegement Center will be able to see all of the signals and work on rescue operations.

## Project Requirements and User Stories
To see the project requirements and the user stories, check the [Kanban board](https://github.com/users/davimnz/projects/1) in the projects session of the repository.

## Installation and Setup

1. `git clone https://github.com/davimnz/gsl-iot-project-2022.git`

### MySQL setup
Since MySQL doesn't accept remote connections (other than local ones), we need to create a user specifically for managing the database from a remote user:
  - First we need to change the MySQL configuration to disable only local connections in `/etc/mysql/mysql.conf.d/mysqld.cnf`
  - In the file, search for the line `bind-address = 127.0.0.1` and comment it
  - Then restart MySQL: `sudo systemctl restart mysql`
  - We now access the MySQL console with: `sudo mysql -u root -p`
  - Now we create a new remote user: ``CREATE USER 'USERNAME'@'IPADDRESS' IDENTIFIED BY 'PASSWORD' WITH GRANT OPTION;
  #### NOTE: We can create a remote user from any IP address with `'USERNAME'@'%'` although this is not recommended for security reasons
  - Now we grant the user with access to the database we are going to use: `GRANT ALL PRIVILEGES ON databasename to 'USERNAME'@'IPADDRESS';`
This proccess will allow us to accessthe database from a remote machine, in this case this process is necessary for the Python program to acces the remote SQL database.

### Python Setup
To use Python with MySQL we need to install the correspondent dependencies with: `pip install mysql-connector-python`

## Deliverables

- Client and Edge Stage: 
  
  > the presentation of the completeness of delivery regarding the client and network can be viewed through the following link:
  > https://drive.google.com/file/d/1aE8qR1RyihElATBoQanrAm80lTyvcDa4/view?usp=sharing

##
- Cloud Implementation stage: 
  
  > the presentation of the cloud implementation through a Python program and the use of an SQL Databse can be seen in:
  > [https://drive.google.com/file/d/1lIf6yrpUf2LC-CPkCHGg42z8YCCDZjcB/view?usp=sharing]

<p align="right">(<a href="#readme-top">back to top</a>)</p>
