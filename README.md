# Task-Manager-with-Role-Based-Access-Control

## Overview

This project aims to facilitate task management and access control across three distinct roles: Admin, Project Manager, and Developer.

## Functionality

- **User Creation**: Upon self-registration, users are automatically assigned the "Developer" role. To gain access to the system, users must complete email verification via a confirmation email.
- **Login**: Authentication is managed through JWT. Non-verified users attempting to log in will receive a follow-up email prompting them to verify their email address.
- **Admin Privileges**: Administrators have the authority to modify a user's role to that of a project manager.
- **Projects**: Only administrators and project managers have the authority to create and modify projects, as well as assign members to them. Project managers are specifically allowed to create, update, and assign members to projects they have created. Additionally, during the creation or modification of a project, they may upload a maximum of five required files per project.

## Future Enhancements

- Other functionalities and enhancements are currently underway as part of the ongoing development process.

## Installation

In the project directory, you can run:

### `npm install` or `yarn`

### `npm start` or `yarn start`
