# [2.1.0](https://github.com/betagouv/nexauth/compare/v2.0.3...v2.1.0) (2022-05-08)


### Features

* **AuthProvider:** add more error cases ([b9941de](https://github.com/betagouv/nexauth/commit/b9941de785a5d106d6e8633f52e07a8116a83c29))
* **Nexauth:** make not found error conditional via config.withNotFoundError ([a1dd9d5](https://github.com/betagouv/nexauth/commit/a1dd9d511faeb7d53bcf228c394abb621ca100e3))

## [2.0.3](https://github.com/betagouv/nexauth/compare/v2.0.2...v2.0.3) (2022-02-28)

## [2.0.2](https://github.com/betagouv/nexauth/compare/v2.0.1...v2.0.2) (2022-02-16)


### Bug Fixes

* move bcryptjs to deps ([aa54fa9](https://github.com/betagouv/nexauth/commit/aa54fa9e65537e3b4da4d8b3c435c46fbbb79f50))

## [2.0.1](https://github.com/betagouv/nexauth/compare/v2.0.0...v2.0.1) (2022-02-16)


### Bug Fixes

* **AuthProvider:** remove debounce on refresh() ([7f423f1](https://github.com/betagouv/nexauth/commit/7f423f17343cc74085c0aefecffb8a2b768f0167))


### Performance Improvements

* **AuthProvider:** replace user state by ref to save one re-render ([354c730](https://github.com/betagouv/nexauth/commit/354c730c1b7150b15efbfd096781a1d74d18bb3c))

# [2.0.0](https://github.com/betagouv/nexauth/compare/v1.4.1...v2.0.0) (2022-02-15)


### Build System

* split and pre-bundle client, CLI and server code ([#27](https://github.com/betagouv/nexauth/issues/27)) ([fe7a5d4](https://github.com/betagouv/nexauth/commit/fe7a5d422411148e95ea9bf5c24a92db22d5b56f))


### BREAKING CHANGES

* client exports must now be called via 'nexauth/client'.

This will dramatically improve the final size of bundled code.

## [1.4.1](https://github.com/betagouv/nexauth/compare/v1.4.0...v1.4.1) (2022-02-15)


### Bug Fixes

* **npm:** remove starting dots in direct exports ([#25](https://github.com/betagouv/nexauth/issues/25)) ([8e33cf4](https://github.com/betagouv/nexauth/commit/8e33cf4cd8f90660fd589e1bd66618ec79ed7184))

# [1.4.0](https://github.com/betagouv/nexauth/compare/v1.3.2...v1.4.0) (2022-02-15)


### Features

* remove use of jwt-decode in provider ([#22](https://github.com/betagouv/nexauth/issues/22)) ([d735c5a](https://github.com/betagouv/nexauth/commit/d735c5a6247497ac312fbba22f6e05713ae8665a))

## [1.3.2](https://github.com/betagouv/nexauth/compare/v1.3.1...v1.3.2) (2022-02-15)


### Bug Fixes

* call access token expiration watcher on access token change ([#20](https://github.com/betagouv/nexauth/issues/20)) ([5e2229d](https://github.com/betagouv/nexauth/commit/5e2229d3def0e8cae41564983c8a31e197ce3c8f))

## [1.3.1](https://github.com/betagouv/nexauth/compare/v1.3.0...v1.3.1) (2022-02-15)


### Bug Fixes

* call right function to watch access token expiration ([#18](https://github.com/betagouv/nexauth/issues/18)) ([967eece](https://github.com/betagouv/nexauth/commit/967eece83cc9049c6330da0d4a6cdd2d2f712127))

# [1.3.0](https://github.com/betagouv/nexauth/compare/v1.2.0...v1.3.0) (2022-02-15)


### Features

* add access token auto-refresh before expiration ([#16](https://github.com/betagouv/nexauth/issues/16)) ([ad05853](https://github.com/betagouv/nexauth/commit/ad058532be31c4a0cd18119287e5924f5d3657a1))

# [1.2.0](https://github.com/betagouv/nexauth/compare/v1.1.0...v1.2.0) (2022-02-15)


### Features

* return access token in refresh() method ([#14](https://github.com/betagouv/nexauth/issues/14)) ([9a149bc](https://github.com/betagouv/nexauth/commit/9a149bc225cb9401b84b8ae7d7a8279dfd44d356))

# [1.1.0](https://github.com/betagouv/nexauth/compare/v1.0.0...v1.1.0) (2022-02-14)


### Features

* allow tokens expiration customization via env ([#11](https://github.com/betagouv/nexauth/issues/11)) ([1f475dd](https://github.com/betagouv/nexauth/commit/1f475ddedb512572a5a1bd6e4bcd23f82ebaef18))
