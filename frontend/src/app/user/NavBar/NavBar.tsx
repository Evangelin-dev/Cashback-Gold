import { ChevronDown, User } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../../store";
import CustomImage from "../../components/custom/Image";
import { logoutUser } from "../../features/slices/authSlice";

export const MENU = [
	{ name: "Home", link: "/" },
	{ name: "About Us", link: "/aboutus" },
	{ name: "Buy Ornaments", link: "/buyornaments" },
	{ name: "Contact Us", link: "/contactus" },
];

const NavBar = () => {
	const [selected, setSelected] = useState<string | null>(null);
	const [hovered, setHovered] = useState<string | null>(null);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

	const { currentUser } = useSelector((state: RootState) => state.auth);
	const dispatch = useDispatch<AppDispatch>();

	const userMenuRef = useRef<HTMLDivElement>(null);

	// Handle clicking outside the user menu to close it
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
				setIsUserMenuOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Check screen size and update mobile state
	useEffect(() => {
		const checkScreenSize = () => {
			const mobile = window.innerWidth < 768;
			setIsMobile(mobile);
			if (!mobile) {
				setIsMobileMenuOpen(false);
			}
		};

		checkScreenSize();
		window.addEventListener("resize", checkScreenSize);
		return () => window.removeEventListener("resize", checkScreenSize);
	}, []);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const handleMenuItemClick = (menuName: string) => {
		setSelected(menuName);
		setIsMobileMenuOpen(false); // Close mobile menu when item is clicked
	};

	const handleLogout = () => {
		dispatch(logoutUser());
		setIsUserMenuOpen(false);
		setIsMobileMenuOpen(false); // Close mobile menu on logout
	};

	return (
		<>
			{/* Maroon top bar with contact and social icons */}
			<div
				style={{
					background: "#6a0822",
					width: "100%",
					minHeight: isMobile ? 40 : 44,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: isMobile ? "0 4vw" : "0 2vw",
					borderBottom: "1.5px solid #fff",
					fontFamily: "'Red Hat Display', 'DM Sans', Arial, sans-serif",
					fontSize: isMobile ? 14 : 18,
					fontWeight: 400,
					letterSpacing: 0.2,
					boxSizing: "border-box",
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					zIndex: 1100,
				}}
			>
				<div style={{
					display: "flex",
					alignItems: "center",
					gap: isMobile ? 8 : 20,
					flexWrap: "wrap",
					flex: 1
				}}>
					<span style={{
						color: "#fff",
						display: "flex",
						alignItems: "center",
						gap: 4,
						minWidth: 0
					}}>
						<img
							src="/home/call.png"
							alt="Phone"
							style={{
								height: isMobile ? 20 : 26,
								width: isMobile ? 20 : 26,
								background: "transparent",
								padding: 3,
								marginRight: isMobile ? 4 : 7,
								display: "block",
								flexShrink: 0
							}}
						/>
						<span style={{
							fontWeight: 600,
							fontSize: isMobile ? 12 : 15,
							letterSpacing: 0.2,
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis"
						}}>
							+91 81900 59995
						</span>
					</span>
					{!isMobile && (
						<span style={{
							color: "#fff",
							display: "flex",
							alignItems: "center",
							gap: 8,
							borderLeft: "2px solid #fff",
							paddingLeft: 16,
							minWidth: 0,
							overflow: "hidden"
						}}>
							<img
								src="/home/Mail.png"
								alt="Mail"
								style={{
									height: 26,
									width: 26,
									background: "transparent",
									padding: 3,
									marginRight: 7,
									display: "block",
									flexShrink: 0
								}}
							/>
							<span style={{
								fontWeight: 600,
								fontSize: 15,
								letterSpacing: 0.2,
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap"
							}}>
								spprtgreenheapdigigold@gmail.com
							</span>
						</span>
					)}
				</div>
				<div style={{
					display: "flex",
					alignItems: "center",
					gap: isMobile ? 4 : 8,
					flexShrink: 0
				}}>
					<a href="#" style={{ marginRight: isMobile ? 0 : 2 }}>
						<img
							src="/home/Facebook.png"
							alt="Facebook"
							style={{
								height: isMobile ? 20 : 26,
								width: isMobile ? 20 : 26,
							}}
						/>
					</a>
					<a href="#" style={{ marginRight: isMobile ? 0 : 2 }}>
						<img
							src="/home/insta.png"
							alt="Instagram"
							style={{
								height: isMobile ? 20 : 26,
								width: isMobile ? 20 : 26,
							}}
						/>
					</a>
					<a href="#" style={{ marginRight: isMobile ? 0 : 2 }}>
						<img
							src="/home/X.png"
							alt="X"
							style={{
								height: isMobile ? 20 : 26,
								width: isMobile ? 20 : 26,
							}}
						/>
					</a>
					{!isMobile && (
						<>
							<a href="#" style={{ marginRight: 2 }}>
								<img
									src="/home/Youtube.png"
									alt="YouTube"
									style={{ height: 26, width: 26 }}
								/>
							</a>
							<a href="#">
								<img
									src="/home/Linkedin.png"
									alt="LinkedIn"
									style={{ height: 26, width: 26 }}
								/>
							</a>
						</>
					)}
				</div>
			</div>

			{/* Main nav */}
			<nav
				style={{
					background: "#fff",
					width: "100%",
					boxShadow: "0 2px 8px #f0e3d1",
					position: "fixed",
					top: isMobile ? 40 : 44,
					left: 0,
					right: 0,
					zIndex: 1000,
					overflow: "visible",
					minHeight: 0,
				}}
			>
				<div
					style={{
						maxWidth: 1200,
						margin: "0 auto",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						padding: isMobile ? "0.3rem 4vw" : "0.2rem 2vw",
						width: "100%",
						boxSizing: "border-box",
						fontFamily: "'Red Hat Display', 'DM Sans', Arial, sans-serif",
						position: "relative"
					}}
				>
					{/* Logo */}
					<a href="/" style={{ display: "flex", alignItems: "center", minWidth: 50 }}>
						<CustomImage
							src={"/logo.png"}
							wrapperClss={`h-auto ${isMobile ? "w-[60px] min-w-[50px]" : "w-[80px] min-w-[70px]"}`}
							height="auto"
							width={isMobile ? "60px" : "80px"}
						/>
					</a>

					<div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
						{/* Desktop Menu & Categories */}
						{!isMobile && (
							<>
								<div
									style={{
										position: "relative",
										flex: "0 0 auto",
									}}
								>
									<button
										type="button"
										onClick={() => setHovered(hovered === "categories" ? null : "categories")}
										onMouseEnter={() => setHovered("categories")}
										style={{
											display: "flex",
											alignItems: "center",
											gap: "8px",
											padding: "12px 20px",
											background: hovered === "categories"
												? "linear-gradient(135deg, #6a0822 0%, #8a2342 100%)"
												: "rgba(106, 8, 34, 0.1)",
											color: hovered === "categories" ? "#fff" : "#6a0822",
											border: "none",
											borderRadius: "12px",
											fontWeight: 600,
											fontSize: "15px",
											cursor: "pointer",
											transition: "all 0.3s",
											boxShadow: hovered === "categories"
												? "0 4px 16px rgba(106, 8, 34, 0.3)"
												: "0 2px 8px rgba(0, 0, 0, 0.1)",
											transform: hovered === "categories" ? "translateY(-2px)" : "translateY(0)",
											whiteSpace: "nowrap",
										}}
									>
										All Categories
										<ChevronDown
											size={16}
											style={{
												transform: hovered === "categories" ? "rotate(180deg)" : "rotate(0deg)",
												transition: "transform 0.3s ease"
											}}
										/>
									</button>
									{hovered === "categories" && (
										<div
											style={{
												position: "absolute",
												top: "60px",
												left: 0,
												background: "rgba(255, 255, 255, 0.98)",
												backdropFilter: "blur(20px)",
												borderRadius: "20px",
												boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
												minWidth: "600px",
												width: "auto",
												zIndex: 3000,
												overflow: "hidden",
												border: "1px solid rgba(255, 255, 255, 0.2)",
												animation: "slideIn 0.3s ease-out",
												padding: undefined,
												maxHeight: undefined,
												overflowY: undefined,
											}}
											onMouseLeave={() => setHovered(null)}
										>
											<div style={{
												background: "linear-gradient(135deg, #6a0822 0%, #8a2342 100%)",
												padding: "20px 24px",
												textAlign: "center"
											}}>
												<h3 style={{
													color: "#fff",
													fontSize: "18px",
													fontWeight: "600",
													margin: "0 0 8px 0"
												}}>
													Browse by Category
												</h3>
												<p style={{
													color: "rgba(255, 255, 255, 0.8)",
													fontSize: "14px",
													margin: 0
												}}>
													Discover our premium collection
												</p>
											</div>
											<div
												style={{
													padding: "24px",
													display: "grid",
													gridTemplateColumns: "1fr 1fr 1fr 1fr",
													gap: "24px"
												}}
											>
												{[
													{
														name: "Gold",
														icon: "",
														color: "#FFD700",
														bgColor: "rgba(255, 215, 0, 0.1)",
														subcategories: ["Men", "Women", "Kids", "Unisex"]
													},
													{
														name: "Silver",
														icon: "",
														color: "#C0C0C0",
														bgColor: "rgba(192, 192, 192, 0.1)",
														subcategories: ["Men", "Women", "Kids", "Unisex"]
													},
													{
														name: "Diamond",
														icon: "",
														color: "#E5E4E2",
														bgColor: "rgba(229, 228, 226, 0.1)",
														subcategories: ["Men", "Women", "Kids", "Unisex"]
													},
													{
														name: "Gold coin",
														icon: "",
														color: "#FFD700",
														bgColor: "rgba(229, 228, 226, 0.1)",
														subcategories: ["22k coin", "24k coin"]
													}
												].map((category, index) => (
													<div
														key={category.name}
														style={{
															background: category.bgColor,
															borderRadius: "16px",
															padding: "20px",
															border: `1px solid ${category.color}30`,
															transition: "all 0.3s ease"
														}}
														onMouseEnter={e => {
															e.currentTarget.style.transform = "translateY(-4px)";
															e.currentTarget.style.boxShadow = `0 8px 24px ${category.color}40`;
														}}
														onMouseLeave={e => {
															e.currentTarget.style.transform = "translateY(0)";
															e.currentTarget.style.boxShadow = "none";
														}}
													>
														<div style={{
															display: "flex",
															alignItems: "center",
															gap: "12px",
															marginBottom: "16px"
														}}>
															<span style={{ fontSize: "24px" }}>{category.icon}</span>
															<h4 style={{
																color: "#374151",
																fontSize: "16px",
																fontWeight: "600",
																margin: 0
															}}>
																{category.name}
															</h4>
														</div>
														<div style={{
															display: "flex",
															flexDirection: "column",
															gap: "8px"
														}}>
															{category.subcategories.map((sub, subIndex) => (
																<a
																	key={sub}
																	href={`/category/${category.name.toLowerCase()}/${sub.toLowerCase()}`}
																	style={{
																		display: "flex",
																		alignItems: "center",
																		gap: "8px",
																		padding: "8px 12px",
																		borderRadius: "8px",
																		textDecoration: "none",
																		color: "#6B7280",
																		fontWeight: 500,
																		fontSize: "14px",
																		transition: "all 0.3s ease"
																	}}
																	onMouseEnter={e => {
																		e.currentTarget.style.background = "rgba(106, 8, 34, 0.1)";
																		e.currentTarget.style.color = "#6a0822";
																		e.currentTarget.style.transform = "translateX(4px)";
																	}}
																	onMouseLeave={e => {
																		e.currentTarget.style.background = "transparent";
																		e.currentTarget.style.color = "#6B7280";
																		e.currentTarget.style.transform = "translateX(0)";
																	}}
																	onClick={() => setHovered(null)}
																>
																	<span style={{ fontSize: "16px" }}>
																		{sub === "Men" ? "" : sub === "Women" ? "" : sub === "Kids" ? "" : ""}
																	</span>
																	{sub}
																</a>
															))}
														</div>
													</div>
												))}
											</div>
										</div>
									)}
								</div>
								<ul
									style={{
										display: "flex", alignItems: "center", gap: 12, margin: 0,
										padding: 0, listStyle: "none", fontSize: 15, fontWeight: 500,
									}}
								>
									{MENU.map((menuItem) => (
										<li key={menuItem.name}>
											<a
												href={menuItem.link}
												onClick={() => setSelected(menuItem.name)}
												onMouseEnter={() => setHovered(menuItem.name)}
												onMouseLeave={() => setHovered(null)}
												style={{
													color: selected === menuItem.name ? "#8a2342" : hovered === menuItem.name ? "#fff" : "#222",
													background: selected === menuItem.name ? "#f9e9c7" : hovered === menuItem.name ? "#7a1335" : "transparent",
													fontWeight: selected === menuItem.name ? 700 : 500,
													textDecoration: "none", padding: "4px 14px", transition: "all 0.18s",
													borderRadius: 7, whiteSpace: "nowrap", cursor: "pointer",
												}}
											>
												{menuItem.name}
											</a>
										</li>
									))}
								</ul>
							</>
						)}
					</div>

					{/* Right-side Actions & Mobile Menu Toggle */}
					<div style={{ display: "flex", alignItems: "center", gap: isMobile ? 12 : 16 }}>
						{currentUser ? (
							<div style={{ position: "relative" }} ref={userMenuRef}>
								<button
									type="button"
									onClick={() => setIsUserMenuOpen(prev => !prev)}
									style={{
										display: 'flex', height: '40px', width: '40px', alignItems: 'center', justifyContent: 'center',
										borderRadius: '9999px', background: '#e5e7eb', color: '#6a0822',
										transition: 'all 0.2s', border: 'none', cursor: 'pointer'
									}}
								>
									<User size={20} />
								</button>
								{isUserMenuOpen && (
									<div style={{
										position: 'absolute', top: '100%', right: 0, marginTop: '8px', width: '12rem',
										borderRadius: '0.5rem', border: '1px solid #e5e7eb', backgroundColor: '#ffffff',
										boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', zIndex: 2000
									}}>
										<div style={{ padding: '0.5rem' }}>
											{currentUser.role === 'USER' && (
												<Link to="/user" onClick={() => setIsUserMenuOpen(false)} style={{
													textDecoration: 'none', display: 'block', width: '100%', borderRadius: '0.25rem',
													padding: '0.5rem 1rem', textAlign: 'left', fontSize: '0.875rem', color: '#374151'
												}}>My Account</Link>
											)}
											{currentUser.role === 'B2B' && (
												<Link to="/bdashboard" onClick={() => setIsUserMenuOpen(false)} style={{
													textDecoration: 'none', display: 'block', width: '100%', borderRadius: '0.25rem',
													padding: '0.5rem 1rem', textAlign: 'left', fontSize: '0.875rem', color: '#374151'
												}}>B2B Dashboard</Link>
											)}
											{currentUser.role === 'PARTNER' && (
												<Link to="/pdashboard" onClick={() => setIsUserMenuOpen(false)} style={{
													textDecoration: 'none', display: 'block', width: '100%', borderRadius: '0.25rem',
													padding: '0.5rem 1rem', textAlign: 'left', fontSize: '0.875rem', color: '#374151'
												}}>PARTNER Dashboard</Link>
											)}
											<button onClick={handleLogout} style={{
												display: 'block', width: '100%', borderRadius: '0.25rem', padding: '0.5rem 1rem',
												textAlign: 'left', fontSize: '0.875rem', color: '#374151', background: 'none',
												border: 'none', cursor: 'pointer'
											}}>Logout</button>
										</div>
									</div>
								)}
							</div>
						) : (
							// Desktop action buttons - hidden on mobile
							!isMobile && (
								<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
									<a
										href="/PartnerPopup"
										style={{
											background: "#7a1335", color: "#fff", borderRadius: 10, padding: "8px 16px",
											fontWeight: 600, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap",
											cursor: "pointer", transition: "background 0.2s"
										}}
										onMouseEnter={(e) => e.currentTarget.style.background = "#8a2342"}
										onMouseLeave={(e) => e.currentTarget.style.background = "#7a1335"}
									>
										Become a partner / Login
									</a>
									<a
										href="/b2b/register"
										style={{
											background: hovered === "B2B Register" ? "rgba(106, 8, 34, 0.05)" : "transparent",
											color: "#7a1335", border: "1.5px solid #7a1335", borderRadius: 10,
											padding: "6.5px 14.5px", fontWeight: 600, fontSize: 13, textDecoration: "none",
											whiteSpace: "nowrap", cursor: "pointer", transition: "all 0.2s"
										}}
										onMouseEnter={() => setHovered("B2B Register")}
										onMouseLeave={() => setHovered(null)}
									>
										B2B Register
									</a>
									<a
										href="/SignupPopup"
										style={{
											color: "#8a2342", fontWeight: 700, fontSize: 15, textDecoration: "none",
											whiteSpace: "nowrap", padding: "7px 16px", borderRadius: 10,
											background: "transparent", border: "1.5px solid transparent", cursor: "pointer",
										}}
									>
										Login / Signup
									</a>
								</div>
							)
						)}

						{/* Mobile Menu Button */}
						{isMobile && (
							<button
								type="button"
								onClick={toggleMobileMenu}
								aria-label="Toggle mobile menu"
								aria-expanded={isMobileMenuOpen}
								style={{
									background: "transparent", border: "none", cursor: "pointer", padding: "5px",
									display: "flex", flexDirection: "column", gap: "3px", alignItems: "center",
									justifyContent: "center", width: "30px", height: "30px"
								}}
							>
								<span style={{
									width: "20px", height: "2px", backgroundColor: "#7a1335", transition: "all 0.3s",
									transform: isMobileMenuOpen ? "rotate(45deg) translate(5px, 5px)" : "none"
								}}></span>
								<span style={{
									width: "20px", height: "2px", backgroundColor: "#7a1335",
									transition: "all 0.3s", opacity: isMobileMenuOpen ? 0 : 1
								}}></span>
								<span style={{
									width: "20px", height: "2px", backgroundColor: "#7a1335", transition: "all 0.3s",
									transform: isMobileMenuOpen ? "rotate(-45deg) translate(7px, -6px)" : "none"
								}}></span>
							</button>
						)}
					</div>
				</div>

				{/* Mobile Menu Dropdown */}
				{isMobile && (
					<div
						style={{
							position: "absolute", top: "100%", left: 0, right: 0, background: "#fff",
							boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
							transform: isMobileMenuOpen ? "translateY(0)" : "translateY(-110%)",
							opacity: isMobileMenuOpen ? 1 : 0,
							visibility: isMobileMenuOpen ? "visible" : "hidden",
							transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)", zIndex: 999,
							maxHeight: isMobileMenuOpen ? "calc(100vh - 100px)" : "0",
							overflowY: "auto"
						}}
					>
						<div style={{ padding: "1rem 4vw" }}>
							<ul style={{ listStyle: "none", margin: 0, padding: 0, fontSize: 16, fontWeight: 500 }}>
								{MENU.map((menuItem) => (
									<li key={menuItem.name} style={{ marginBottom: "0.5rem" }}>
										<a
											href={menuItem.link}
											onClick={() => handleMenuItemClick(menuItem.name)}
											style={{
												color: selected === menuItem.name ? "#8a2342" : "#222",
												background: selected === menuItem.name ? "#f9e9c7" : "transparent",
												fontWeight: selected === menuItem.name ? 700 : 500,
												textDecoration: "none", padding: "12px 16px", display: "block",
												borderRadius: 8, transition: "all 0.18s", cursor: "pointer"
											}}
										>
											{menuItem.name}
										</a>
									</li>
								))}
							</ul>
							<div className="mt-4 flex flex-col gap-3 border-t pt-4">
								{/* Mobile Action Buttons */}
								{currentUser ? (
									<>
										<Link to="/user" onClick={() => setIsMobileMenuOpen(false)} className="w-full rounded-lg bg-gray-100 px-4 py-3 text-center font-bold text-[#8a2342]">My Account</Link>
										<button onClick={handleLogout} className="w-full rounded-lg border border-[#8a2342] px-4 py-3 text-center font-bold text-[#8a2342]">Logout</button>
									</>
								) : (
									<>
										<a href="/PartnerPopup" className="w-full rounded-lg bg-[#7a1335] px-4 py-3 text-center font-medium text-white">Become a partner / Login</a>
										<a href="/b2bregister" className="w-full rounded-lg border border-[#8a2342] px-4 py-3 text-center font-bold text-[#8a2342]">B2B Register</a>
										<a href="/SignupPopup" className="w-full rounded-lg border border-[#8a2342] px-4 py-3 text-center font-bold text-[#8a2342]">User Login / Signup</a>
									</>
								)}
							</div>
						</div>
					</div>
				)}
			</nav>
		</>
	);
};

export default NavBar;