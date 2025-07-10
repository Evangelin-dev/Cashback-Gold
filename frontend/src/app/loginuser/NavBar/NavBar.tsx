import { ChevronDown, Crown, LogOut, Mail, Menu, Phone, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import CustomImage from "../../components/custom/Image";

export const MENU = [
	{ name: "Home", link: "/LUserHome" },
	{ name: "About Us", link: "/laboutus" },
	{ name: "Buy Ornaments", link: "/lbuyornaments" },
	{ name: "Contact Us", link: "/lcontactus" },
];

const LNavBar = () => {
	const [selected, setSelected] = useState<string | null>(null);
	const [hovered, setHovered] = useState<string | null>(null);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			setScreenWidth(window.innerWidth);
			if (window.innerWidth > 768) {
				setMobileMenuOpen(false);
			}
		};

		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener('resize', handleResize);
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	const toggleMobileMenu = () => {
		setMobileMenuOpen(!mobileMenuOpen);
	};

	const closeMobileMenu = () => {
		setMobileMenuOpen(false);
	};

	// Responsive breakpoints
	const isMobile = screenWidth <= 768;
	const isTablet = screenWidth > 768 && screenWidth <= 1024;
	const isDesktop = screenWidth > 1024;

	return (
		<>
			{/* Top Contact Bar */}
			<div
				style={{
					background: "linear-gradient(135deg, #6a0822 0%, #8a2342 100%)",
					width: "100%",
					minHeight: isMobile ? "40px" : "48px",
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					padding: isMobile ? "0 16px" : "0 24px",
					borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
					fontFamily: "'Inter', 'Red Hat Display', 'DM Sans', Arial, sans-serif",
					fontSize: isMobile ? "12px" : "14px",
					fontWeight: 500,
					position: "fixed",
					top: 0,
					left: 0,
					right: 0,
					zIndex: 1100,
					boxShadow: isScrolled ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
					transition: "all 0.3s ease",
					backdropFilter: "blur(10px)"
				}}
			>
				{/* Contact Information */}
				<div style={{ 
					display: "flex", 
					alignItems: "center", 
					gap: isMobile ? "12px" : "20px",
					flex: 1
				}}>
					<div style={{ 
						color: "#fff", 
						display: "flex", 
						alignItems: "center", 
						gap: "8px",
						opacity: 0.95
					}}>
						<Phone size={isMobile ? 16 : 18} />
						{!isMobile && (
							<span style={{ 
								fontWeight: 600, 
								letterSpacing: "0.5px"
							}}>
								+91 81900 59995
							</span>
						)}
					</div>
					
					{(isTablet || isDesktop) && (
						<div style={{
							color: "#fff",
							display: "flex",
							alignItems: "center",
							gap: "8px",
							paddingLeft: "16px",
							borderLeft: "1px solid rgba(255, 255, 255, 0.3)",
							opacity: 0.95
						}}>
							<Mail size={18} />
							<span style={{ 
								fontWeight: 600, 
								letterSpacing: "0.5px",
								fontSize: isTablet ? "13px" : "14px"
							}}>
								spprtgreenheapdigigold@gmail.com
							</span>
						</div>
					)}
				</div>

				{/* Social Media Icons */}
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
								background: "transparent", 
								padding: 3, 
								display: "block", 
								transition: "transform 0.15s" 
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
								background: "transparent", 
								padding: 3, 
								display: "block", 
								transition: "transform 0.15s" 
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
								background: "transparent", 
								padding: 3, 
								display: "block", 
								transition: "transform 0.15s" 
							}} 
						/>
					</a>
					{!isMobile && (
						<>
							<a href="#" style={{ marginRight: 2 }}>
								<img 
									src="/home/Youtube.png" 
									alt="YouTube" 
									style={{ 
										height: 26, 
										width: 26, 
										background: "transparent", 
										padding: 3, 
										display: "block", 
										transition: "transform 0.15s" 
									}} 
								/>
							</a>
							<a href="#">
								<img 
									src="/home/Linkedin.png" 
									alt="LinkedIn" 
									style={{ 
										height: 26, 
										width: 26, 
										background: "transparent", 
										padding: 3, 
										display: "block", 
										transition: "transform 0.15s" 
									}} 
								/>
							</a>
						</>
					)}
				</div>
			</div>
			
			{/* Main Navigation */}
			<nav
				style={{
					background: isScrolled ? "rgba(255, 255, 255, 0.95)" : "#fff",
					backdropFilter: isScrolled ? "blur(20px)" : "none",
					width: "100%",
					boxShadow: isScrolled 
						? "0 8px 32px rgba(0, 0, 0, 0.12)" 
						: "0 2px 8px rgba(240, 227, 209, 0.3)",
					position: "fixed",
					top: isMobile ? "40px" : "48px",
					left: 0,
					right: 0,
					zIndex: 1000,
					minHeight: isMobile ? "60px" : "72px",
					transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
					borderBottom: "1px solid rgba(240, 227, 209, 0.5)"
				}}
			>
				<div
					style={{
						maxWidth: "1400px",
						margin: "0 auto",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						padding: isMobile ? "12px 16px" : "16px 24px",
						width: "100%",
						boxSizing: "border-box",
						fontFamily: "'Inter', 'Red Hat Display', 'DM Sans', Arial, sans-serif",
						position: "relative",
						flexWrap: isMobile ? "wrap" : "nowrap"
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

					{/* All Category Dropdown - Responsive INSIDE NAVBAR for mobile */}
					{isMobile && (
						<div
							style={{
								width: "100%",
								marginTop: "8px",
								display: "flex",
								justifyContent: "center"
							}}
						>
							<button
								onClick={() => setHovered(hovered === "categories" ? null : "categories")}
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									gap: "6px",
									width: "98vw",
									maxWidth: "420px",
									padding: "12px 8px",
									background: hovered === "categories"
										? "linear-gradient(135deg, #6a0822 0%, #8a2342 100%)"
										: "rgba(106, 8, 34, 0.1)",
									color: hovered === "categories" ? "#fff" : "#6a0822",
									border: "none",
									borderRadius: "12px",
									fontWeight: 600,
									fontSize: "15px",
									cursor: "pointer",
									transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
									boxShadow: hovered === "categories"
										? "0 4px 16px rgba(106, 8, 34, 0.3)"
										: "0 2px 8px rgba(0, 0, 0, 0.1)",
									transform: hovered === "categories" ? "translateY(-2px)" : "translateY(0)",
									whiteSpace: "nowrap",
									marginBottom: "8px",
								}}
							>
								<span style={{ fontSize: "17px" }}></span>
								<span style={{ fontSize: "15px" }}>All Categories</span>
								<ChevronDown
									size={16}
									style={{
										transform: hovered === "categories" ? "rotate(180deg)" : "rotate(0deg)",
										transition: "transform 0.3s ease"
									}}
								/>
							</button>
							{/* Dropdown for mobile */}
							{hovered === "categories" && (
								<div
									style={{
										position: "fixed",
										top: "calc(100px + 48px)",
										left: 0,
										right: 0,
										background: "rgba(255, 255, 255, 0.98)",
										backdropFilter: "blur(20px)",
										borderRadius: "0",
										boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
										width: "100vw",
										zIndex: 3000,
										overflow: "hidden",
										border: "1px solid rgba(255, 255, 255, 0.2)",
										animation: "slideIn 0.3s ease-out",
										padding: "0",
										maxHeight: "calc(100vh - 160px)",
										overflowY: "auto",
									}}
									onClick={() => setHovered(null)}
								>
									<div style={{
										background: "linear-gradient(135deg, #6a0822 0%, #8a2342 100%)",
										padding: "12px",
										textAlign: "center"
									}}>
										<h3 style={{
											color: "#fff",
											fontSize: "16px",
											fontWeight: "600",
											margin: "0 0 8px 0"
										}}>
											Browse by Category
										</h3>
										<p style={{
											color: "rgba(255, 255, 255, 0.8)",
											fontSize: "13px",
											margin: 0
										}}>
											Discover our premium collection
										</p>
									</div>
									<div
										style={{
											padding: "12px",
											display: "grid",
											gridTemplateColumns: "1fr",
											gap: "12px"
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
												name: "Platinum",
												icon: "",
												color: "#E5E4E2",
												bgColor: "rgba(229, 228, 226, 0.1)",
												subcategories: ["Men", "Women", "Kids", "Unisex"]
											}
										].map((category, index) => (
											<div
												key={category.name}
												style={{
													background: category.bgColor,
													borderRadius: "16px",
													padding: "12px",
													border: `1px solid ${category.color}30`,
													transition: "all 0.3s ease"
												}}
											>
												<div style={{
													display: "flex",
													alignItems: "center",
													gap: "12px",
													marginBottom: "12px"
												}}>
													<span style={{ fontSize: "20px" }}>{category.icon}</span>
													<h4 style={{
														color: "#374151",
														fontSize: "15px",
														fontWeight: "600",
														margin: 0
													}}>
														{category.name}
													</h4>
												</div>
												<div style={{
													display: "flex",
													flexDirection: "row",
													gap: "8px",
													flexWrap: "wrap"
												}}>
													{category.subcategories.map((sub, subIndex) => (
														<a
															key={sub}
															href={`/category/${category.name.toLowerCase()}/${sub.toLowerCase()}`}
															style={{
																display: "flex",
																alignItems: "center",
																gap: "6px",
																padding: "7px 10px",
																borderRadius: "8px",
																textDecoration: "none",
																color: "#6B7280",
																fontWeight: 500,
																fontSize: "13px",
																transition: "all 0.3s ease"
															}}
															onClick={() => setHovered(null)}
														>
															<span style={{ fontSize: "14px" }}>
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
					)}
					{/* Desktop All Category */}
					{!isMobile && (
						<div
							style={{
								position: "relative",
								marginLeft: "24px",
								flex: "0 0 auto",
								width: "auto",
								marginTop: 0,
								display: "flex",
								justifyContent: "flex-start",
							}}
						>
							<button
								onClick={() => setHovered(hovered === "categories" ? null : "categories")}
								onMouseEnter={() => setHovered("categories")}
								style={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									gap: "8px",
									width: "auto",
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
									transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
									boxShadow: hovered === "categories"
										? "0 4px 16px rgba(106, 8, 34, 0.3)"
										: "0 2px 8px rgba(0, 0, 0, 0.1)",
									transform: hovered === "categories" ? "translateY(-2px)" : "translateY(0)",
									whiteSpace: "nowrap",
									marginBottom: 0,
								}}
							>
								<span style={{ fontSize: "18px" }}></span>
								All Categories
								<ChevronDown
									size={16}
									style={{
										transform: hovered === "categories" ? "rotate(180deg)" : "rotate(0deg)",
										transition: "transform 0.3s ease"
									}}
								/>
							</button>
							{/* Dropdown for desktop */}
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
											gridTemplateColumns: "1fr 1fr 1fr",
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
												name: "Platinum",
												icon: "",
												color: "#E5E4E2",
												bgColor: "rgba(229, 228, 226, 0.1)",
												subcategories: ["Men", "Women", "Kids", "Unisex"]
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
					)}

					{/* Desktop Navigation Menu */}
					{!isMobile && (
						<div style={{ 
							display: "flex", 
							alignItems: "center", 
							justifyContent: "center",
							flex: 1
						}}>
							<ul style={{
								display: "flex",
								alignItems: "center",
								gap: isTablet ? "8px" : "16px",
								margin: 0,
								listStyle: "none",
								background: "rgba(248, 250, 252, 0.8)",
								borderRadius: "16px",
								padding: "8px 12px",
								backdropFilter: "blur(10px)",
								border: "1px solid rgba(226, 232, 240, 0.8)"
							}}>
								{MENU.map((menuItem, index) => (
									<li key={menuItem.name}>
										<a
											href={menuItem.link}
											onClick={() => setSelected(menuItem.name)}
											onMouseEnter={() => setHovered(menuItem.name)}
											onMouseLeave={() => setHovered(null)}
											style={{
												color: selected === menuItem.name 
													? "#fff" 
													: hovered === menuItem.name 
														? "#fff" 
														: "#4A5568",
												background: selected === menuItem.name
													? "linear-gradient(135deg, #6a0822 0%, #8a2342 100%)"
													: hovered === menuItem.name
														? "linear-gradient(135deg, #8a2342 0%, #a02f4a 100%)"
														: "transparent",
												fontWeight: selected === menuItem.name ? 600 : 500,
												textDecoration: "none",
												padding: isTablet ? "8px 12px" : "10px 16px",
												borderRadius: "12px",
												transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
												whiteSpace: "nowrap",
												cursor: "pointer",
												fontSize: isTablet ? "14px" : "15px",
												display: "flex",
												alignItems: "center",
												gap: "6px",
												boxShadow: selected === menuItem.name || hovered === menuItem.name
													? "0 4px 12px rgba(106, 8, 34, 0.3)"
													: "none",
												transform: hovered === menuItem.name ? "translateY(-2px)" : "translateY(0)"
											}}
										>
											{menuItem.name}
											{hovered === menuItem.name && (
												<ChevronDown size={14} style={{ 
													transform: "rotate(-90deg)",
													transition: "transform 0.3s ease"
												}} />
											)}
										</a>
									</li>
								))}
							</ul>
						</div>
					)}

					{/* Right Section - Desktop */}
					{!isMobile && (
						<div style={{ 
							display: "flex", 
							alignItems: "center", 
							gap: "12px",
							flex: "0 0 auto"
						}}>
							{/* Partner Button */}
							<a
								href="/PartnerPopup"
								style={{
									background: hovered === "partner" 
										? "linear-gradient(135deg, #8a2342 0%, #a02f4a 100%)" 
										: "linear-gradient(135deg, #6a0822 0%, #8a2342 100%)",
									color: "#fff",
									borderRadius: "12px",
									padding: isTablet ? "8px 16px" : "10px 20px",
									fontWeight: 600,
									fontSize: isTablet ? "13px" : "14px",
									display: "flex",
									alignItems: "center",
									gap: "8px",
									textDecoration: "none",
									transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
									whiteSpace: "nowrap",
									cursor: "pointer",
									boxShadow: "0 4px 16px rgba(106, 8, 34, 0.3)",
									transform: hovered === "partner" ? "translateY(-2px)" : "translateY(0)"
								}}
								onMouseEnter={() => setHovered("partner")}
								onMouseLeave={() => setHovered(null)}
							>
								<span style={{ fontSize: "16px" }}>🤝</span>
								{isDesktop ? "Become a Partner" : "Partner"}
							</a>
							
							{/* User Profile */}
							<div style={{ position: "relative" }}>
								<button
									onClick={() => setHovered(hovered === "profile" ? null : "profile")}
									style={{
										background: hovered === "profile" 
											? "linear-gradient(135deg, #6a0822 0%, #8a2342 100%)" 
											: "#fff",
										border: hovered === "profile" 
											? "2px solid transparent" 
											: "2px solid #E2E8F0",
										borderRadius: "50%",
										width: "48px",
										height: "48px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										cursor: "pointer",
										boxShadow: hovered === "profile" 
											? "0 8px 24px rgba(106, 8, 34, 0.4)" 
											: "0 2px 8px rgba(0, 0, 0, 0.1)",
										transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
										position: "relative",
										zIndex: 1001,
										transform: hovered === "profile" ? "scale(1.1)" : "scale(1)"
									}}
								>
									<div style={{
										width: "36px",
										height: "36px",
										borderRadius: "50%",
										background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										fontSize: "16px",
										fontWeight: "bold",
										color: "#fff"
									}}>
										👤
									</div>
									{hovered === "profile" && (
										<div style={{
											position: "absolute",
											top: "-2px",
											right: "-2px",
											width: "20px",
											height: "20px",
											background: "linear-gradient(45deg, #FFD700, #FFA500)",
											borderRadius: "50%",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											animation: "pulse 2s infinite"
										}}>
											<Crown size={10} color="#fff" />
										</div>
									)}
								</button>
								
								{/* Profile Dropdown */}
								{hovered === "profile" && (
									<div
										style={{
											position: "absolute",
											top: "60px",
											right: 0,
											background: "rgba(255, 255, 255, 0.98)",
											backdropFilter: "blur(20px)",
											borderRadius: "20px",
											boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
											minWidth: "300px",
											zIndex: 2000,
											overflow: "hidden",
											border: "1px solid rgba(255, 255, 255, 0.2)",
											animation: "slideIn 0.3s ease-out"
										}}
										onMouseLeave={() => setHovered(null)}
									>
										{/* Profile Header */}
										<div style={{
											background: "linear-gradient(135deg, #6a0822 0%, #8a2342 100%)",
											padding: "24px",
											textAlign: "center",
											position: "relative"
										}}>
											<div style={{
												width: "80px",
												height: "80px",
												borderRadius: "50%",
												background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
												margin: "0 auto 16px",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												fontSize: "32px",
												border: "4px solid rgba(255, 255, 255, 0.2)"
											}}>
												👤
											</div>
											<h3 style={{
												color: "#fff",
												fontSize: "18px",
												fontWeight: "600",
												margin: "0 0 8px 0"
											}}>
												John Doe
											</h3>
											<p style={{
												color: "rgba(255, 255, 255, 0.8)",
												fontSize: "14px",
												margin: 0
											}}>
												Premium Member
											</p>
										</div>

										{/* Menu Items */}
										<div style={{ padding: "16px" }}>
											{[
												{ icon: User, label: "Dashboard", href: "/user" },
												{ icon: LogOut, label: "Logout", href: "/", danger: true }
											].map((item, index) => (
												<a
													key={index}
													href={item.href}
													style={{
														display: "flex",
														alignItems: "center",
														gap: "12px",
														padding: "12px 16px",
														borderRadius: "12px",
														textDecoration: "none",
														color: item.danger ? "#EF4444" : "#374151",
														fontWeight: 500,
														fontSize: "14px",
														transition: "all 0.3s ease",
														marginBottom: index < 3 ? "4px" : "0"
													}}
													onMouseEnter={e => {
														e.currentTarget.style.background = item.danger 
															? "rgba(239, 68, 68, 0.1)" 
															: "rgba(106, 8, 34, 0.1)";
														e.currentTarget.style.transform = "translateX(4px)";
													}}
													onMouseLeave={e => {
														e.currentTarget.style.background = "transparent";
														e.currentTarget.style.transform = "translateX(0)";
													}}
													onClick={() => setHovered(null)}
												>
													<item.icon size={18} />
													{item.label}
												</a>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Mobile Menu Button */}
					{isMobile && (
						<button
							onClick={toggleMobileMenu}
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								background: mobileMenuOpen 
									? "linear-gradient(135deg, #6a0822 0%, #8a2342 100%)" 
									: "rgba(106, 8, 34, 0.1)",
								border: "none",
								borderRadius: "12px",
								width: "48px",
								height: "48px",
								cursor: "pointer",
								transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
								color: mobileMenuOpen ? "#fff" : "#6a0822",
								boxShadow: mobileMenuOpen 
									? "0 4px 16px rgba(106, 8, 34, 0.3)" 
									: "0 2px 8px rgba(0, 0, 0, 0.1)",
								transform: mobileMenuOpen ? "scale(1.1)" : "scale(1)"
							}}
						>
							{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
						</button>
					)}
				</div>
			</nav>

			{/* Mobile Menu Overlay */}
			{mobileMenuOpen && (
				<div
					style={{
						position: "fixed",
						top: "100px",
						left: 0,
						right: 0,
						bottom: 0,
						background: "rgba(0, 0, 0, 0.6)",
						zIndex: 999,
						backdropFilter: "blur(4px)",
						animation: "fadeIn 0.3s ease"
					}}
					onClick={closeMobileMenu}
				/>
			)}

			{/* Mobile Menu */}
			<div
				style={{
					position: "fixed",
					top: "100px",
					left: 0,
					right: 0,
					background: "#fff",
					boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
					zIndex: 1000,
					maxHeight: "calc(100vh - 100px)",
					overflowY: "auto",
					transform: mobileMenuOpen ? "translateY(0)" : "translateY(-100%)",
					transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
					opacity: mobileMenuOpen ? 1 : 0,
					visibility: mobileMenuOpen ? "visible" : "hidden"
				}}
			>
				<div style={{ padding: "24px 16px" }}>
					{/* User Profile Section */}
					<div style={{
						display: "flex",
						alignItems: "center",
						gap: "16px",
						padding: "20px",
						background: "linear-gradient(135deg, #6a0822 0%, #8a2342 100%)",
						borderRadius: "16px",
						marginBottom: "24px",
						color: "#fff"
					}}>
						<div style={{
							width: "60px",
							height: "60px",
							borderRadius: "50%",
							background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: "24px",
							border: "3px solid rgba(255, 255, 255, 0.2)"
						}}>
							👤
						</div>
						<div>
							<h3 style={{
								fontSize: "18px",
								fontWeight: "600",
								margin: "0 0 4px 0"
							}}>
								John Doe
							</h3>
							<p style={{
								fontSize: "14px",
								margin: 0,
								opacity: 0.8
							}}>
								Premium Member
							</p>
						</div>
					</div>

					{/* Navigation Menu */}
					<div style={{ marginBottom: "24px" }}>
						<h4 style={{
							fontSize: "16px",
							fontWeight: "600",
							color: "#374151",
							marginBottom: "16px",
							paddingLeft: "4px"
						}}>
							Navigation
						</h4>
						<ul style={{
							listStyle: "none",
							margin: 0,
							padding: 0,
							display: "flex",
							flexDirection: "column",
							gap: "8px"
						}}>
							{MENU.map((menuItem, index) => (
								<li key={menuItem.name}>
									<a
										href={menuItem.link}
										onClick={() => {
											setSelected(menuItem.name);
											closeMobileMenu();
										}}
										style={{
											display: "flex",
											alignItems: "center",
											gap: "12px",
											padding: "16px 20px",
											borderRadius: "12px",
											textDecoration: "none",
											color: selected === menuItem.name ? "#fff" : "#374151",
											background: selected === menuItem.name 
												? "linear-gradient(135deg, #6a0822 0%, #8a2342 100%)" 
												: "rgba(248, 250, 252, 0.8)",
											fontWeight: selected === menuItem.name ? 600 : 500,
											fontSize: "16px",
											transition: "all 0.3s ease",
											border: "1px solid",
											borderColor: selected === menuItem.name 
												? "transparent" 
												: "rgba(226, 232, 240, 0.8)",
											boxShadow: selected === menuItem.name 
												? "0 4px 16px rgba(106, 8, 34, 0.3)" 
												: "0 2px 8px rgba(0, 0, 0, 0.05)"
										}}
									>
										<span style={{ fontSize: "20px" }}>
											{index === 0 ? "🏠" : index === 1 ? "ℹ️" : index === 2 ? "💎" : "📞"}
										</span>
										{menuItem.name}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Action Buttons */}
					<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
						<a
							href="/PartnerPopup"
							onClick={closeMobileMenu}
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: "12px",
								padding: "16px 20px",
								background: "linear-gradient(135deg, #6a0822 0%, #8a2342 100%)",
								color: "#fff",
								borderRadius: "12px",
								textDecoration: "none",
								fontWeight: 600,
								fontSize: "16px",
								boxShadow: "0 4px 16px rgba(106, 8, 34, 0.3)",
								transition: "transform 0.3s ease"
							}}
							onTouchStart={e => e.currentTarget.style.transform = "scale(0.98)"}
							onTouchEnd={e => e.currentTarget.style.transform = "scale(1)"}
						>
							<span style={{ fontSize: "20px" }}>🤝</span>
							Become a Partner
						</a>
						
						<a
							href="/logout"
							onClick={closeMobileMenu}
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: "12px",
								padding: "16px 20px",
								background: "rgba(239, 68, 68, 0.1)",
								color: "#EF4444",
								borderRadius: "12px",
								textDecoration: "none",
								fontWeight: 600,
								fontSize: "16px",
								border: "1px solid rgba(239, 68, 68, 0.2)",
								transition: "all 0.3s ease"
							}}
							onTouchStart={e => {
								e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
								e.currentTarget.style.transform = "scale(0.98)";
							}}
							onTouchEnd={e => {
								e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
								e.currentTarget.style.transform = "scale(1)";
							}}
						>
							<LogOut size={20} />
							Logout
						</a>
					</div>
				</div>
			</div>

			<style>
				{`
				@keyframes fadeIn {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				
				@keyframes slideIn {
					from { 
						opacity: 0; 
						transform: translateY(-20px) scale(0.95); 
					}
					to { 
						opacity: 1; 
						transform: translateY(0) scale(1); 
					}
				}
				
				@keyframes pulse {
					0%, 100% { transform: scale(1); }
					50% { transform: scale(1.05); }
				}
				
				/* Enhanced Mobile Optimizations */
				@media (max-width: 480px) {
					body {
						overflow-x: hidden;
					}
				}
				
				/* Touch device optimizations */
				@media (hover: none) and (pointer: coarse) {
					button, a {
						-webkit-tap-highlight-color: transparent;
						touch-action: manipulation;
					}
				}
				
				/* Prevent zoom on input focus for iOS */
				@media screen and (-webkit-min-device-pixel-ratio: 0) {
					input, select, textarea {
						font-size: 16px !important;
					}
				}
				
				/* Smooth scrolling */
				html {
					scroll-behavior: smooth;
				}
				
				/* Custom scrollbar for mobile menu */
				@media (max-width: 768px) {
					::-webkit-scrollbar {
						width: 4px;
					}
					
					::-webkit-scrollbar-thumb {
						background: rgba(255, 255, 255, 0.3);
						border-radius: 2px;
					}
					
					::-webkit-scrollbar-track {
						background: rgba(0, 0, 0, 0.1);
						border-radius: 2px;
					}
				}
				`}
			</style>
		</>
	);
};

export default LNavBar;