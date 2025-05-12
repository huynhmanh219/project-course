"use client"

import SidebarItem from "@/app/(dashboard)/_components/sidebar-item";
import { BarChart, Compass, Layout, List } from "lucide-react"
import { usePathname } from "next/navigation";

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
const teacherRoutes = [
    {
        icon:List,
        label:"Courses",
        href:"/teacher/courses"
    },
    {
        icon:BarChart,
        label:"Analytics",
        href:"/teacher/analytics"
    },
]

export const SidebarRoutes = ()=>{
    const pathName = usePathname();

    const isTeacherPage = pathName?.includes("/teacher")


    const routes = isTeacherPage ? teacherRoutes: guestRoutes;
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