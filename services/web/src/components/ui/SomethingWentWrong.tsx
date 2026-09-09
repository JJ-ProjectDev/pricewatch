import {  ArrowLeft, TriangleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { buttonVariants } from "./button";

export default function SomethingWentWrong() {
  return (
    <div className="flex flex-col items-center mt-30 bg-card/40 py-20 rounded-2xl border border-dashed ">
      <div className="bg-card rounded-full flex size-20 items-center justify-center mb-4">
        <TriangleAlert className="text-primary" size={50} />
      </div>
      <p className="text-foreground font-semibold text-2xl pb-2 mb-3 border-b ">
        Something went wrong
      </p>
      <p className="text-muted-foreground text-sm mb-5">Try again later</p>
      <Link to="/products" className={buttonVariants({ variant: 'default' })}>
        <ArrowLeft size={18} />
        Back to products
      </Link>
    </div>
  )
}
