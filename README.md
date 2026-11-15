# Service Window

Service Window is a React Native / Expo prototype for food truck inventory management. It supports inventory quantities, minimum stock levels, low-stock highlighting, a Restock List derived from current inventory, cooking and adding new dishes, and truck management capabilities.

## Requirements

- Node.js 24 LTS is recommended (the project pins 24.22.1 with Volta).
- npm, included with Node.js.
- For phone testing: Expo Go compatible with SDK 58. Alternatively, use a configured iOS simulator or Android emulator.
- For browser testing: use `npm run web` after installing dependencies. Expo Go is not required.
- For phone testing over LAN, connect the phone and computer to the same Wi-Fi network.
- The prototype requires no application login. No test username or password is needed. The Expo account instructions below apply only to the development environment.

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

If you signed up with Google and have no Expo password, use browser login with Google.

Scan the terminal QR code with Expo Go (the Camera app can open the link on iPhone). From the Expo terminal, press `i` for an installed iOS simulator or `a` for a configured Android emulator. Press Ctrl+C to stop the server.

You can also start a specific platform directly:

```sh
npm run ios
# or
npm run android
```

For a local browser preview, run `npm run web` from `mobile/`, then open the web URL printed by Expo. Expo Go is not required. For a mobile-sized preview, use browser’s developer tools to set the viewport to 390 × 844 pixels.

## Optional developer verification

These checks are optional.

From `mobile/`, check that dependencies match the Expo SDK:

```sh
npx expo install --check
```

The dependency check verifies compatibility with the Expo SDK. Use the manual checks below to verify interaction and appearance. Browser interaction tests are available: run `npx playwright install chromium` once, then `npm test` from `mobile/`. The tests start Expo on port 8081 if it is not already running.

## Troubleshooting

- **`npm ci` reports EUSAGE / missing lockfile:** check `pwd`. If you are in `Team3-HCI-DP4`, run `cd mobile`, then `npm ci`. The existing lockfile is `mobile/package-lock.json`.
- **Expo reports `Team3-HCI-DP4/package.json does not exist`:** run Expo from `mobile/`. Do not install a separate Expo project in the repository root.
- **`expo: command not found`:** run `npm ci` from `mobile/`, then `npm start`, which uses the project's local Expo CLI.
- **Stale Metro cache:** stop the server and run `npm start -- --clear` from `mobile/`.
- **Phone cannot connect:** verify both devices use the same Wi-Fi and that Expo Go supports SDK 58. If LAN access is blocked, try `npm start -- --tunnel`. Expo may prompt to install its tunnel helper.
- **Web dependencies are missing after pulling changes:** stop Expo with Ctrl+C, run `npm ci` from `mobile/`, then restart with `npm run web -- --clear`.

## Project structure

- `mobile/App.js`: shared inventory, dishes, contacts, and vendors state, plus tab selection.
- `mobile/screens/InventoryScreen.js`: inventory and stock/minimum editor.
- `mobile/screens/RestockScreen.js`: derived Restock List, employee contacts, vendor contacts, and order dialogs.
- `mobile/tests/restock.spec.js`: browser tests for restock workflows.
- `mobile/screens/DishScreen.js`: screen displaying current dishes with ingredients and cook options.
- `mobile/screens/TruckManagementScreen.js`: truck management screen.
- `mobile/components/BottomNav.js`: bottom navigation.
- `mobile/theme.js`: shared colors.
- `mobile/assets/`: images and app icons.

## Test the onion workflow

1. Start the app and select **Inventory** in the bottom navigation. Onion starts at 16 lbs with a minimum of 10 lbs.
2. Leave onion's selected quantity at 1 lb and press **Use** six times. At 10 lbs it should remain normal and should not appear in **Restock List**.
3. Return to Inventory and press **Use** once more. At 9 lbs, onion should have a red card and a **(LOW)** label. A red banner should offer a link to Restock List.
4. Open **Restock List**. Onion should appear. Return to Inventory and press **Add** with 1 lb selected. Stock reaches 10 lbs. Reopen Restock List. Onion should be absent.
5. Return to Inventory, reduce onion to 9 lbs again, then open its three-dot menu. Set **Minimum Level** to 9 and tap **Save**. Onion should lose its low-stock styling and be absent when you reopen Restock List.
6. Set the minimum back to 10. Onion should appear in Restock List again. Increase its stock in Inventory to 10, then reopen Restock List. Onion should be absent.
7. In the Inventory screen, try increasing the selected quantity to exceed the current stock. **Use** will become disabled.

Only ingredients with `stock < min` belong on Restock List. Stock equal to the minimum threshold does not trigger restocking. The list is recalculated from shared inventory on every render, including when switching tabs. The **−** and **+** buttons select a quantity without changing stock. **Add** increases stock by that quantity. **Use** decreases it. The selected quantity starts at 1 lb for onion and cannot go below 1.

Inventory changes update among tab switches but are held in memory. Restarting or fully reloading the app resets the initial quantities.

## Add or delete an ingredient

In **Inventory**, select **Add Ingredient**. Enter a unique name, unit, current stock, and minimum stock level, then select **Add Ingredient** to save. Stock values must be valid numbers.

To delete an ingredient, open its three-dot editor and select **Delete**. Confirm deletion to remove it, or select **Cancel** to keep it.

## Text the list and send a vendor order

Start in Inventory. Edit Onion and set Current Stock to 7, leaving Minimum Level at 10. For an order with multiple ingredients, set Rice to 2 bags with a minimum of 5. Open Restock List. Each card shows current and minimum stock levels. It also shows how much is needed to reach the minimum.

To text an employee:

1. Select **Text List** to open Contact List.
2. Choose an employee, or select **Add** to create a contact. All fields are required: name, phone number and email address. The Add button stays disabled until the fields are valid.
3. Select the contact to review their details, then select **Text**.
4. The confirmation displays **Text Sent!**. Select **Done** to return to Restock List.

To order from a vendor:

1. Select **Send Order** to open Vendor List.
2. Choose a vendor, or add one with a name, phone number and email address.
3. Select **Order** to preview the current shortages. Only ingredients below their minimum appear.
4. Add an optional note. **Cancel** returns to vendor details without sending and retains the note for that preview.
5. Select **Send** to see **Order Sent!**, then **Done** to return to the list.

Contact and vendor details can be deleted, with a confirmation step. Closing a dialog cancels the current flow. Added or deleted contacts survive tab changes. Reloading the app resets inventory and contacts to the sample data.

Texts and orders are simulated locally. Sending does not change inventory. Use Inventory's Add action when ingredients arrive. Sample contacts use dummy contact information to retain user privacy. 

## Cook a dish

Open **Dishes** from the bottom navigation. Each dish displays its name, description, and cooking time.

To view ingredients, select **Show Ingredients** on a dish. An overlay will pop up listing the ingredients and quantities required to cook the dish once. Select **Close** to return to the **Dishes** screen.

To cook a dish, select **Cook**. A confirmation screen will ask whether to cook the dish. Selecting **Cancel** will return to the **Dishes** screen without changing inventory. Selecting **Confirm Cook** will reduce the ingredients by the required quantities. A success message will confirm that the dish was cooked and inventory was updated.

The **Cook** button is disabled when a required ingredient is missing, below its minimum stock level, or has insufficient stock for the recipe. A message underneath lists the unavailable ingredients. Use Inventory’s Add action to replenish stock.

To add a dish, select **Add Dish**. Enter the dish name, cooking time in minutes, and dish description. Select the ingredients from inventory and enter the quantity of each required to cook the dish once. Select **Add Dish** to save, or **Cancel** to return without saving.

Adding a dish with the same name will result in it being rejected. Dish names must be unique, cooking times and ingredient quantities are required to be a positive number, and at least one ingredient must be selected for a dish.

Inventory is deducted immediately after confirmation, without waiting for the displayed cooking time. Added dishes survive tab changes. Reloading the app resets dishes and inventory to the sample data.

## Truck management

Open **My Truck** from the bottom navigation.

**My Trucks:** View current trucks under management.

**Events:** View upcoming event with its name, location, date, and time.

**Employees:** View current employees.

**Alerts:** View ingredients below their minimum stock levels. Select **View Restock List** for details.

Select **Close** to dismiss an overlay. Truck locations, events, and employees are fixed sample data and cannot be edited.