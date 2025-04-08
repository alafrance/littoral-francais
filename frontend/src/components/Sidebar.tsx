// import React from "react";
import {useDispatch} from "react-redux";
import {handleItemClick as handleItemClickSlice} from "../stores/sidebarSlice.ts";

export function Sidebar() {
  const dispatch = useDispatch();

  const handleItemClick = (item: string) => {
    dispatch(handleItemClickSlice(item));
  }

  return (
    <div className="w-[250px] p-4 bg-gray-100 rounded-md shadow-md mr-8">
      <h1 className="text-lg font-bold mb-6 text-center">
        Risques encourus sur le littoral français
      </h1>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => handleItemClick("global")}
          className="py-2 px-4 rounded bg-blue-500 text-white text-lg font-bold"
        >
          Global
        </button>
        <button
          onClick={() => handleItemClick("yellow")}
          className="py-2 px-4 rounded bg-white border text-base"
        >
          Item 01 (Jaune)
        </button>
        <button
          onClick={() => handleItemClick("red")}
          className="py-2 px-4 rounded bg-white border text-base"
        >
          Item 02 (Rouge)
        </button>
        <button
          onClick={() => handleItemClick("violet")}
          className="py-2 px-4 rounded bg-white border text-base"
        >
          Item 03 (Violet)
        </button>
      </div>
    </div>
  )
}