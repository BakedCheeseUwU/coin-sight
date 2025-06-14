import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eachDayOfInterval, format, subDays } from "date-fns";
import { accounts, categories, transactions } from "@/db/schema";
import { convertAmountToMiliUnits } from "@/lib/utils";

const connectionString = process.env.DATABASE_URL!;

// Disable prefetch as it is not supported for "Transaction" pool mode
export const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client);

const SEED_USER_ID = "user_2ihYmDdso91bWbwFQHuzMMRS0S8";
const SEED_CATEGORIES = [
  {
    id: "category_1",
    name: "Food",
    userId: SEED_USER_ID,
  },
  {
    id: "category_2",
    name: "Rent",
    userId: SEED_USER_ID,
  },
  {
    id: "category_3",
    name: "Utilities",
    userId: SEED_USER_ID,
  },
  {
    id: "category_4",
    name: "Clothing",
    userId: SEED_USER_ID,
  },
];

const SEED_ACCOUNTS = [
  {
    id: "account_1",
    name: "Checking",
    userId: SEED_USER_ID,
  },
  {
    id: "account_2",
    name: "Savings",
    userId: SEED_USER_ID,
  },
];

const defaultTo = new Date();
const defaultFrom = subDays(defaultTo, 60);

const SEED_TRANSACTIONS: (typeof transactions.$inferSelect)[] = [];

const generateRandomAmount = (category: typeof categories.$inferInsert) => {
  switch (category.name) {
    case "Rent":
      return Math.random() * 400 + 90; // Rent will likely be a large amount
    case "Utilities":
      return Math.random() * 200 + 50;
    case "Food":
      return Math.random() * 30 + 10;
    case "Transportation":
    case "Health":
      return Math.random() * 50 + 15;
    case "Entertainment":
    case "Clothing":
    case "Miscellaneous":
      return Math.random() * 100 + 20;
    default:
      return Math.random() * 50 + 10;
  }
};

const generateTransactionPerDay = (day: Date) => {
  const numTransactions = Math.floor(Math.random() * 4) + 1; // 1 to 4 transactions per day

  for (let i = 0; i < numTransactions; i++) {
    const category =
      SEED_CATEGORIES[Math.floor(Math.random() * SEED_CATEGORIES.length)];
    const isExpense = Math.random() > 0.6; // 60% chance of being an expense
    const amount = generateRandomAmount(category);
    const formattedAmount = convertAmountToMiliUnits(
      isExpense ? -amount : amount,
    ); // negative for expenses

    SEED_TRANSACTIONS.push({
      id: `transaction_${format(day, "yyyy-MM-dd")}_${i}`,
      accountId: SEED_ACCOUNTS[0].id, // using first account
      categoryId: category.id,
      date: day,
      amount: formattedAmount,
      payee: "Merchant",
      notes: "Random transaction",
    });
  }
};

const generateTransactions = () => {
  const days = eachDayOfInterval({
    start: defaultFrom,
    end: defaultTo,
  });

  days.forEach((day) => generateTransactionPerDay(day));
};

generateTransactions();

const main = async () => {
  try {
    // reset database
    await db.delete(transactions).execute();
    await db.delete(accounts).execute();
    await db.delete(categories).execute();

    // seed categories
    await db.insert(categories).values(SEED_CATEGORIES).execute();
    // seed accounts
    await db.insert(accounts).values(SEED_ACCOUNTS).execute();
    // seed transactions
    await db.insert(transactions).values(SEED_TRANSACTIONS).execute();
  } catch (error: unknown) {
    console.error("Error during seed: ", error);
    process.exit(1);
  }
};

main();
