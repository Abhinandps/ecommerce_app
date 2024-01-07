<p align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/6295/6295417.png" width="100" />
</p>
<p align="center">
    <h1 align="center">ECOMMERCE_APP</h1>
</p>



<p align="center">
	<img src="https://img.shields.io/github/license/Abhinandps/ecommerce_app?style=flat&color=0080ff" alt="MIT">
	<img src="https://img.shields.io/github/last-commit/Abhinandps/ecommerce_app?style=flat&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/Abhinandps/ecommerce_app?style=flat&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/Abhinandps/ecommerce_app?style=flat&color=0080ff" alt="repo-language-count">
<p>

<p align="center">
		<em>Developed with the software and tools below.</em>
</p>

<p align="center">
	<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
	<img src="https://img.shields.io/badge/Twilio-F22F46.svg?style=flat&logo=Twilio&logoColor=white" alt="Twilio">
	<img src="https://img.shields.io/badge/Codecov-F01F7A.svg?style=flat&logo=Codecov&logoColor=white" alt="Codecov">
	<img src="https://img.shields.io/badge/HTML5-E34F26.svg?style=flat&logo=HTML5&logoColor=white" alt="HTML5">
	<img src="https://img.shields.io/badge/PostCSS-DD3A0A.svg?style=flat&logo=PostCSS&logoColor=white" alt="PostCSS">
	<img src="https://img.shields.io/badge/Chai-A30701.svg?style=flat&logo=Chai&logoColor=white" alt="Chai">
	<img src="https://img.shields.io/badge/sharp-99CC00.svg?style=flat&logo=sharp&logoColor=white" alt="sharp">
	<img src="https://img.shields.io/badge/Mocha-8D6748.svg?style=flat&logo=Mocha&logoColor=white" alt="Mocha">
	<br>
	<img src="https://img.shields.io/badge/Nodemon-76D04B.svg?style=flat&logo=Nodemon&logoColor=white" alt="Nodemon">
	<img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white" alt="ESLint">
	<img src="https://img.shields.io/badge/MongoDB-47A248.svg?style=flat&logo=MongoDB&logoColor=white" alt="MongoDB">
	<img src="https://img.shields.io/badge/Puppeteer-40B5A4.svg?style=flat&logo=Puppeteer&logoColor=white" alt="Puppeteer">
	<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white" alt="TypeScript">
	<img src="https://img.shields.io/badge/stylelint-263238.svg?style=flat&logo=stylelint&logoColor=white" alt="stylelint">
	<img src="https://img.shields.io/badge/Razorpay-0C2451.svg?style=flat&logo=Razorpay&logoColor=white" alt="Razorpay">
	<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" alt="JSON">
	<img src="https://img.shields.io/badge/Express-000000.svg?style=flat&logo=Express&logoColor=white" alt="Express">
</p>

<hr>

##  Quick Links

> - [ Overview](#-overview)
> - [ Features](#-features)
> - [ Repository Structure](#-repository-structure)
> - [ Getting Started](#-getting-started)
>     - [ Installation](#-installation)
>     - [ Running ecommerce_app](#-running-ecommerce_app)
>     - [ Tests](#-tests)
> - [ Project Roadmap](#-project-roadmap)
> - [ Contributing](#-contributing)
> - [ License](#-license)
> - [ Acknowledgments](#-acknowledgments)

---

##  Overview

summary: HTTPStatusError occurred. See logs for details.

---

##  Features

summary: HTTPStatusError occurred. See logs for details.

---

##  Repository Structure

```sh
└── ecommerce_app/
    ├── Controllers
    │   ├── adminAuth.js
    │   ├── adminController.js
    │   ├── auth.js
    │   ├── errorController.js
    │   ├── userController.js
    │   └── viewController.js
    ├── Models
    │   ├── adminModel.js
    │   ├── banner.js
    │   ├── cartModel.js
    │   ├── category.js
    │   ├── categoryOffer.js
    │   ├── coupen.js
    │   ├── guestUser.js
    │   ├── orders.js
    │   ├── productOffer.js
    │   ├── products.js
    │   ├── rating.js
    │   ├── userModel.js
    │   └── wishList.js
    ├── Routes
    │   ├── adminRoutes.js
    │   ├── userRoutes.js
    │   └── viewRoutes.js
    ├── app.js
    ├── middleware
    │   └── auth.js
    ├── package-lock.json
    ├── package.json
    ├── public
    │   ├── css
    │   │   ├── style-prefix.css
    │   │   ├── style.css
    │   │   ├── style.min.css
    │   │   └── toast.css
    │   ├── js
    │   │   ├── admin.js
    │   │   ├── filter.js
    │   │   ├── loader.js
    │   │   ├── main.js
    │   │   ├── script.js
    │   │   └── user.js
    │   ├── lib
    │   │   ├── cropperjs
    │   │   ├── easing
    │   │   └── owlcarousel
    │   ├── mail
    │   │   ├── contact.js
    │   │   ├── contact.php
    │   │   └── jqBootstrapValidation.min.js
    │   ├── scss
    │   │   ├── bootstrap
    │   │   └── style.scss
    │   └── src
    │       └── images
    ├── server.js
    ├── template.html
    ├── utils
    │   ├── appError.js
    │   ├── catchAsync.js
    │   ├── generateInvoice.js
    │   ├── generateReport.js
    │   ├── guestUtils.js
    │   ├── multerConfig.js
    │   ├── pagination.js
    │   └── pdfkitTables.js
    └── views
        ├── admin
        │   ├── login.ejs
        │   └── pages
        ├── layouts
        │   ├── adminFooter.ejs
        │   ├── adminHeader.ejs
        │   ├── footer.ejs
        │   └── header.ejs
        └── user
            ├── 404.ejs
            ├── cart.ejs
            ├── checkout.ejs
            ├── home.ejs
            ├── order.ejs
            ├── orderDetails.ejs
            ├── payment.ejs
            ├── profile.ejs
            ├── shop.ejs
            ├── shopDetails.ejs
            └── wishList.ejs
```

---

##  Getting Started

***Requirements***

Ensure you have the following dependencies installed on your system:

<!-- * **Sassy CSS**: `version x.y.z` -->

###  Installation

1. Clone the ecommerce_app repository:

```sh
git clone https://github.com/Abhinandps/ecommerce_app
```

2. Change to the project directory:

```sh
cd ecommerce_app
```

3. Install the dependencies:

```sh
> npm install
```

###  Running ecommerce_app

Use the following command to run ecommerce_app:

```sh
> npm start
```

###  Tests

To execute tests, run:

```sh
> npm run dev
```

---


##  Contributing

Contributions are welcome! Here are several ways you can contribute:

- **[Submit Pull Requests](https://github/Abhinandps/ecommerce_app/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.
- **[Join the Discussions](https://github/Abhinandps/ecommerce_app/discussions)**: Share your insights, provide feedback, or ask questions.
- **[Report Issues](https://github/Abhinandps/ecommerce_app/issues)**: Submit bugs found or log feature requests for Ecommerce_app.

<details closed>
    <summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your GitHub account.
2. **Clone Locally**: Clone the forked repository to your local machine using a Git client.
   ```sh
   git clone https://github.com/Abhinandps/ecommerce_app
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to GitHub**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.

Once your PR is reviewed and approved, it will be merged into the main branch.

</details>

---

##  License

This project is protected under the [MIT](LICENSE) License. For more details, refer to the [LICENSE](LICENSE) file.

---

<!-- ##  Acknowledgments

- List any resources, contributors, inspiration, etc. here.

[**Return**](#-quick-links)

--- -->
