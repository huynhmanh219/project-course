"use client"

import SidebarItem from "@/app/(dashboard)/_components/sidebar-item";
import { Compass, Layout } from "lucide-react"

const guestRoutes = [
    {
        icon:Layout,
        label:"Dashboard",
        href:"/"
    },
    {
        icon:Compass,
        label:"Browse",
        href:"/seach"
    },
]

export const SidebarRoutes = ()=>{
    const routes = guestRoutes;
    return(
        <>
            <div className="flex flex-col w-full">
                {routes.map((route)=>(
                    <SidebarItem
                    key={route.href}
                    icon ={route.icon}
                    label= {route.label}
                    href = {route.href}
                    >

                    </SidebarItem>
                ))}
            </div>
        </>
    )
}