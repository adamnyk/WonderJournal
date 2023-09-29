import { useContext, useState } from "react";
import UserContext from "../UserContext";
import {
	Navbar,
	Nav,
	NavItem,
	NavbarToggler,
	Collapse,
	NavLink,
	NavbarBrand,
} from "reactstrap";
import { NavLink as RRNavlink } from "react-router-dom";
import "./NavBar.css"

const NavBar = ({ logout }) => {
	const { currentUser } = useContext(UserContext);
	const [isOpen, setIsOpen] = useState(false);

	const toggle = () => setIsOpen(!isOpen);

	return (
		<div>
			<Navbar expand="md" className="NavBar shadow-sm">
				<NavbarBrand tag={RRNavlink} to="/">
					WonderJournal
				</NavbarBrand>

				<NavbarToggler className="me-2 navbar-light" onClick={toggle} />
				<Collapse isOpen={isOpen} navbar>
					<Nav className="ms-auto" navbar>
						{currentUser ? (
							<>
								<NavItem>
									<NavLink tag={RRNavlink} to="/moments">
										Reflect
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink tag={RRNavlink} to="/moments/new">
										New Moment
									</NavLink>
								</NavItem>
								
								<NavItem>
									<NavLink tag={RRNavlink} onClick={logout} to="/logout">
										Logout
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink tag={RRNavlink} to="/profile">
									<i className="fa-solid fa-user"></i>
									</NavLink>
								</NavItem>
							</>
						) : (
							<>
								<NavItem>
									<NavLink tag={RRNavlink} to="/login">
										Login
									</NavLink>
								</NavItem>
								<NavItem>
									<NavLink tag={RRNavlink} to="/signup">
										Sign Up
									</NavLink>
								</NavItem>
							</>
						)}
					</Nav>
				</Collapse>
			</Navbar>
		</div>
	);
};

export default NavBar;
