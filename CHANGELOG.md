# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.0.1](https://github.com/JamesTeague/cyrus/compare/v2.0.0...v2.0.1) (2022-06-10)

## [2.0.0](https://github.com/JamesTeague/cyrus/compare/v1.0.0...v2.0.0) (2020-03-31)


### ⚠ BREAKING CHANGES

* **memorynotifier:** There is no longer a ready emission. Any filters for ready should be deprecated and
any operators that may skip the very first emission will now be skipping real data.

### Bug Fixes

* fix import that was left behind ([315084c](https://github.com/JamesTeague/cyrus/commit/315084cdde748ca5978fd8f8d4e8f8effbd4fab0))


### Improvements

* **memorynotifier:** leverage Rx Subjects ([eac137d](https://github.com/JamesTeague/cyrus/commit/eac137d0f53771b097bbcef42ad4d407c022d6b7))

### [0.2.4](https://github.com/JamesTeague/cyrus/compare/v0.2.3...v0.2.4) (2020-01-02)


### Features

* add ability to disconnect from database ([5768dcd](https://github.com/JamesTeague/cyrus/commit/5768dcd7a099d99f6ac1bac0aac3740cb1f963e2))

### [0.2.3](https://github.com/JamesTeague/cyrus/compare/v0.2.2...v0.2.3) (2020-01-01)


### Bug Fixes

* correct construction of library failing ([05f5f42](https://github.com/JamesTeague/cyrus/commit/05f5f42f505f87691317d6b9d65a53b5a10c2931))
