import { cva, VariantProps } from "class-variance-authority";
import { IconType } from "react-icons/lib";

import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
const boxVariant = cva("shrink-0 rounded-md p-3", {
  variants: {
    variant: {
      default: "bg-purple-500/20",
      success: "bg-emerald-500/20",
      danger: "bg-rose-500/20",
      warning: "bg-yellow-500/20",
    },
    defaultVariants: {
      variant: "default",
    },
  },
});

const iconVariant = cva("size-6", {
  variants: {
    variant: {
      default: "fill-purple-500",
      success: "fil-emerald-500",
      danger: "fil-rose-500",
      warning: "fill-yellow-500",
    },
    defaultVariants: {
      variant: "default",
    },
  },
});

type BoxVariants = VariantProps<typeof boxVariant>;
type IconVariants = VariantProps<typeof iconVariant>;

