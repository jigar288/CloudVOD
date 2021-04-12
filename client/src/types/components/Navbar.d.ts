export type NavbarPath = { name: String; icon?: JSX.Element; authenticated?: boolean; href?: string; external?: boolean }
export type NavbarProps = { paths: NavbarPath[] }
