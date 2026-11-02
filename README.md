# Service Window

Service Window is a React Native / Expo prototype for food truck inventory management. It supports inventory quantities, minimum stock levels, low-stock highlighting, and a Restock List derived from current inventory.

## Requirements

- Node.js 24 LTS is recommended (the project pins 24.22.1 with Volta).
- npm, included with Node.js.
- Expo Go compatible with SDK 58 for testing on a phone, or an iOS simulator / Android emulator.
- For phone testing over LAN, connect the phone and computer to the same Wi-Fi network.

## Install and start

The Expo app lives in `mobile/`. Run all npm and Expo commands from that directory, not the repository root.

From a fresh clone:

```sh
git clone https://github.com/Kodali7/Team3-HCI-DP4.git
cd Team3-HCI-DP4/mobile
npm ci
npx expo login --browser
npm start
```

If your terminal is already at `Team3-HCI-DP4`, use:

```sh
cd mobile
npm ci
npx expo login --browser
npm start
```

Before scanning the QR code, create a free Expo account in Expo Go or at [expo.dev](https://expo.dev/signup), then sign in to Expo Go on your phone. Sign in to the **same account** in the CLI using the login command above. It opens a browser, where you can use the same sign-in method, including **Continue with Google** if you created your account with Google.

From `mobile/`, these commands let you choose a login method and check your account:

```sh
npx expo login -b           # Browser login (same as --browser)
npx expo login --no-browser # Enter an Expo username/email and Expo password in the terminal
npx expo login --help       # Show all login options (-h also works)
npx expo whoami             # Confirm which account the CLI is using
```

`-b` starts browser login; `-h` shows the available options. If you signed up with Google and have no Expo password, use browser login with Google.

Scan the terminal QR code with Expo Go (the Camera app can open the link on iPhone). From the Expo terminal, press `i` for an installed iOS simulator or `a` for a configured Android emulator. Press Ctrl+C to stop the server.

You can also start a specific platform directly:

```sh
npm run ios
# or
npm run android
```

The web script is present, but browser dependencies are not installed in this mobile setup. Use a phone or simulator for the workflow below.

## Check the code

From `mobile/`, check that dependencies match the Expo SDK:

```sh
npx expo install --check
```

Check that Metro can bundle the application without launching a simulator:

```sh
npx expo export --platform ios --output-dir dist/ios
npx expo export --platform android --output-dir dist/android
```

These checks validate dependencies and bundling; use the manual checks below to verify interaction and appearance. There is currently no automated UI test suite or `npm test` script.

## Test the onion workflow

1. Start the app and select **Inventory** in the bottom navigation. Onion starts at 16 lbs with a minimum of 10 lbs.
2. Leave onion's selected quantity at 1 lb and press **Use** six times. At 10 lbs it should remain normal and should not appear in **Restock List**.
3. Return to Inventory and press **Use** once more. At 9 lbs, onion should have a red card and a **(LOW)** label. A red banner should offer a link to Restock List.
4. Open **Restock List**. Onion should appear. With 1 lb selected, press **Add** once; stock reaches 10 lbs and onion should disappear immediately.
5. Return to Inventory, reduce onion to 9 lbs again, then open its three-dot menu. Set **Minimum Level** to 9 and tap **Save**. Onion should lose its low-stock styling and be absent when you reopen Restock List.
6. Set the minimum back to 10. Onion should appear in Restock List again. Increase its stock in Inventory to 10, then reopen Restock List; onion should be absent.
7. In the editor, try an empty or negative quantity. Saving should show a validation error. **Use** is disabled when the selected quantity exceeds current stock.

Only ingredients with `stock < min` belong on Restock List. Matching the minimum is sufficient. The list is recalculated from shared inventory on every render, including when switching tabs. The **−** and **+** buttons select a quantity without changing stock. **Add** increases stock by that quantity; **Use** decreases it. The selected quantity starts at 1 lb for onion and cannot go below 1.

Inventory changes survive tab switches but are held in memory; restarting or fully reloading the app resets the initial quantities.

## Troubleshooting

- **`npm ci` reports EUSAGE / missing lockfile:** check `pwd`. If you are in `Team3-HCI-DP4`, run `cd mobile`, then `npm ci`. The existing lockfile is `mobile/package-lock.json`.
- **Expo reports `Team3-HCI-DP4/package.json does not exist`:** run Expo from `mobile/`. Do not install a separate Expo project in the repository root.
- **`expo: command not found`:** run `npm ci` from `mobile/`, then `npm start`, which uses the project's local Expo CLI.
- **Stale Metro cache:** stop the server and run `npm start -- --clear` from `mobile/`.
- **Phone cannot connect:** verify both devices use the same Wi-Fi and that Expo Go supports SDK 58. If LAN access is blocked, try `npm start -- --tunnel`; Expo may prompt to install its tunnel helper.
- **`git switch -b` reports an unknown option:** use `git switch main` for an existing branch or `git switch -c your-branch-name` to create a new branch. `-b` belongs to `git checkout`.

## Project structure

- `mobile/App.js`: shared inventory state and tab selection.
- `mobile/screens/InventoryScreen.js`: inventory, Restock List, and stock/minimum editor.
- `mobile/screens/TruckManagementScreen.js`: truck management screen.
- `mobile/components/BottomNav.js`: bottom navigation.
- `mobile/theme.js`: shared colors.
- `mobile/assets/`: images and app icons.
