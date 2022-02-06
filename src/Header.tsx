import './Header.css'
import React from 'react'

interface HeaderProps {
  title: string
}

const Header: React.FC<HeaderProps> = ({ title }: HeaderProps) => (
  <div className="header">{title}</div>
)

export default Header
