import Image from "next/image";
const Logo = () => {
    return ( <>
        <Image src="/logo.svg"
        width={50}
        height={100}
        alt="logo"
        >
        </Image>
    </> );
}
 
export default Logo;