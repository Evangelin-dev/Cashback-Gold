import { ChevronDown, Crown, LogOut, Menu, ShoppingCart, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CiShoppingCart } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../store";

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
	const dispatch = useDispatch();
	const { currentUser } = useSelector((state: RootState) => state.auth);
	const navigate = useNavigate();
	const cartItems = useSelector((state: RootState) => state.cart.items);
	const cartLength = cartItems.length;
	console.log(cartLength,'bb')
	// Logout handler
	const handleLogout = (e?: React.MouseEvent) => {
		if (e) e.preventDefault();
		// Clear user from redux (replace with your actual logout action)
		dispatch({ type: 'auth/logout' });
		navigate("/");
		setHovered(null);
	};
	// Only show Home if on My Account page
	const currentPath = window.location.pathname;
	const isMyAccount = currentPath === "/user" || currentPath === "/myaccount";
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
			{/* Main Navigation */}
			<nav className={`fixed left-0 right-0 z-30 w-full border-b border-red-100/50 transition-all duration-300 ease-in-out md:top-0 top-0 ${isScrolled ? 'bg-white/95 shadow-xl backdrop-blur-lg' : 'bg-white shadow-sm'}`}>
				<div
					style={{
						maxWidth: "1400px",
						margin: "0 auto",
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						padding: isMobile ? "6px 8px" : "8px 16px",
						width: "100%",
						boxSizing: "border-box",
						fontFamily: "'Inter', 'Red Hat Display', 'DM Sans', Arial, sans-serif",
						position: "relative",
						flexWrap: isMobile ? "wrap" : "nowrap",
						minHeight: isMobile ? "44px" : "48px"
					}}
				>
					{/* Logo and All Categories - always together on the left */}
					<div className="flex items-center gap-2 mr-auto">
						<a href="/" style={{ display: "flex", alignItems: "center", minWidth: 32 }}>
							<img
								src={"/logo.png"}
								alt="Logo"
								height="auto"
								width={isMobile ? "32px" : "36px"}
								style={{ maxHeight: isMobile ? "32px" : "36px" }}
							/>
						</a>
						<div className="relative">
							<button
								onClick={() => setHovered(hovered === "categories" ? null : "categories")}
								onMouseEnter={() => setHovered("categories")}
								className={`flex items-center gap-1 px-2 py-1 rounded-md font-semibold text-[12px] cursor-pointer transition-all duration-200 whitespace-nowrap border border-[#6a0822] text-[#6a0822] bg-white ${hovered === 'categories' ? 'ring-2 ring-[#6a0822]' : ''}`}
								style={{ minWidth: 0 }}
							>
								<ChevronDown size={12} className={`transition-transform duration-200 ${hovered === 'categories' ? 'rotate-180' : ''}`} />
								<span className="text-[12px]">All Categories</span>
							</button>
							{/* Dropdown for both mobile and desktop */}
							{hovered === "categories" && (
								<div
									className="absolute left-0 mt-1 bg-white rounded-lg shadow-lg min-w-[220px] z-[3000] border border-[#6a0822]/10 animate-slideIn"
									onMouseLeave={() => setHovered(null)}
								>
									<div className="p-2 grid grid-cols-1 gap-2">
										{[
											{
												name: "Gold",
												icon: "",
												subcategories: ["Men", "Women", "Kids", "Unisex"]
											},
											{
												name: "Silver",
												icon: "",
												subcategories: ["Men", "Women", "Kids", "Unisex"]
											},
											{
												name: "Gold coin",
												icon: "",
												subcategories: ["22k coin", "24k coin"]
											}
										].map((category, index) => (
											<div
												key={category.name}
												className="rounded-md p-2 border border-[#6a0822]/10 transition-all duration-200 bg-white"
											>
												<div className="flex items-center gap-2 mb-1">
													<span className="text-[12px]">{category.icon}</span>
													<h4 className="text-black text-[11px] font-semibold m-0">{category.name}</h4>
												</div>
												<div className="flex flex-row gap-1 flex-wrap">
													{category.subcategories.map((sub, subIndex) => (
														<a
															key={sub}
															href={`/category/${category.name.toLowerCase()}/${sub.toLowerCase()}`}
															className="flex items-center gap-1 px-2 py-1 rounded bg-gray-50 text-gray-600 font-medium text-[10px] transition-all duration-200 hover:bg-[#6a0822]/10 hover:text-[#6a0822]"
															onClick={() => setHovered(null)}
														>
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
					</div>

					{/* Desktop Navigation Menu */}
					{!isMobile && !isMyAccount && (
						<div className="flex items-center justify-center flex-1">
							<ul className="flex items-center gap-2 md:gap-3 m-0 list-none bg-slate-50/80 rounded-2xl py-1 px-2 backdrop-blur border border-slate-200/80">
								{MENU.map((menuItem, index) => (
									<li key={menuItem.name}>
										<a
											href={menuItem.link}
											onClick={() => setSelected(menuItem.name)}
											onMouseEnter={() => setHovered(menuItem.name)}
											onMouseLeave={() => setHovered(null)}
											className={`flex items-center gap-1 md:gap-1.5 font-medium md:text-[14px] text-[13px] px-2 md:px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all duration-300 ${selected === menuItem.name || hovered === menuItem.name ? 'bg-[#6a0822] text-white shadow-lg -translate-y-0.5' : 'bg-transparent text-gray-700'}`}
											style={
												selected === menuItem.name || hovered === menuItem.name
													? { background: '#6a0822', color: '#fff' }
													: {}
											}
										>
											{menuItem.name}
											{hovered === menuItem.name && (
												<ChevronDown size={14} className="-rotate-90 transition-transform duration-300" />
											)}
										</a>
									</li>
								))}
							</ul>
						</div>
					)}

					{/* Right Section - Desktop */}
					{!isMobile && (
						<div className="flex items-center gap-2 flex-shrink-0">
							{/* If My Account, show Home and Cart here */}
							{isMyAccount && (
								<>
									<a
										href={MENU[0].link}
										className={`flex items-center gap-1 font-semibold text-[13px] px-2 py-1 rounded-md whitespace-nowrap cursor-pointer transition-all duration-200 ${selected === MENU[0].name ? 'bg-[#6a0822] text-white shadow' : 'bg-slate-50/80 text-gray-700'}`}
										onClick={() => setSelected(MENU[0].name)}
									>
										{MENU[0].name}
									</a>
									<div className="relative">
										<button
											className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-50/80 text-[#6a0822] hover:bg-[#6a0822] hover:text-white transition-all duration-200 shadow"
											onClick={() => navigate("/cart")}
											aria-label="Cart"
										>
											<ShoppingCart size={18} />
										</button>

										{cartLength > 0 && (
											<span className="absolute top-1 right-1 text-[10px] min-w-[16px] h-[16px] px-[4px] bg-red-600 text-white rounded-full flex items-center justify-center">
												{cartLength}
											</span>
										)}
									</div>

								</>
							)}
							{/* Partner Button */}
							<a
								href="/PartnerPopup"
								className={`flex items-center gap-1 font-semibold bg-[#6a0822] text-white rounded-md px-2 py-1 shadow transition-all duration-200 whitespace-nowrap text-[13px] ${hovered === 'partner' ? 'opacity-90' : ''}`}
								onMouseEnter={() => setHovered("partner")}
								onMouseLeave={() => setHovered(null)}
							>
								<span className="text-[13px]">🤝</span>
								{isDesktop ? "Partner" : "Partner"}
							</a>
							{/* User Profile and Cart Icon */}
							{!isMyAccount && (
								<div className="flex items-center gap-2">
									<div className="relative">
										<button
											onClick={() => setHovered(hovered === "profile" ? null : "profile")}
											className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 relative z-[1001] ${hovered === 'profile' ? 'bg-[#6a0822] scale-110 shadow border-0 text-white' : 'bg-white border-2 border-slate-200 shadow text-[#6a0822]'}`}
										>
											<div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[#6a0822] font-bold text-[13px]">
												👤
											</div>
											{hovered === "profile" && (
												<div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
													<Crown size={8} color="#fff" />
												</div>
											)}
										</button>
										{/* Profile Dropdown */}
										{hovered === "profile" && (
											<div
												className="absolute top-[40px] right-0 bg-white rounded-lg shadow-lg min-w-[180px] z-[2000] border border-white/20 animate-slideIn"
												onMouseLeave={() => setHovered(null)}
											>
												{/* Profile Header */}
												<div className="bg-[#6a0822] p-3 text-center relative rounded-t-lg">
													<div className="w-10 h-10 rounded-full bg-slate-200 mx-auto mb-2 flex items-center justify-center text-[18px] border-2 border-white/20">
														👤
													</div>
													<h3 className="text-white text-[13px] font-semibold mb-1">{currentUser?.email || ""}</h3>
													<p className="text-white/80 text-[11px] m-0">{currentUser?.role || ""} Member</p>
												</div>
												{/* Menu Items */}
												<div className="p-2">
													<a
														href="/user"
														className="flex items-center gap-2 px-2 py-2 rounded-md text-[12px] font-medium transition-all duration-200 mb-1 text-slate-700 hover:bg-[#6a0822]/10 hover:text-[#6a0822] hover:translate-x-1"
														onClick={() => setHovered(null)}
													>
														<User size={14} />
														Dashboard
													</a>
													<a
														href="/"
														className="flex items-center gap-2 px-2 py-2 rounded-md text-[12px] font-medium transition-all duration-200 mb-1 text-red-500 hover:bg-red-100 hover:translate-x-1"
														onClick={handleLogout}
													>
														<LogOut size={14} />
														Logout
													</a>
												</div>
											</div>
										)}
									</div>
									<div className="relative">
										<button
											className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-50/80 text-[#6a0822] hover:bg-[#6a0822] hover:text-white transition-all duration-200 shadow"
											onClick={() => navigate("/cart")}
											aria-label="Cart"
										>
											<ShoppingCart size={18} />
										</button>

										{cartLength > 0 && (
											<span className="absolute -top-1 -right-1 text-[10px] min-w-[16px] h-[16px] px-[4px] bg-red-600 text-white rounded-full flex items-center justify-center">
												{cartLength}
											</span>
										)}
									</div>

								</div>
							)}
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
					{/* User Profile Section (only if logged in) */}
					{currentUser ? (
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
									{currentUser?.email || "User"}
								</h3>
								<p style={{
									fontSize: "14px",
									margin: 0,
									opacity: 0.8
								}}>
									{currentUser?.role ? `${currentUser.role} Member` : "Member"}
								</p>
							</div>
						</div>
					) : (
						<div style={{ marginBottom: "24px" }}>
							<a
								href="/SignupPopup"
								onClick={closeMobileMenu}
								className="flex items-center justify-center gap-3 py-4 px-5 bg-[#6a0822] text-white rounded-xl no-underline font-semibold text-[16px] shadow transition-transform duration-300 active:scale-95"
							>
								<span className="text-[20px]">🔐</span>
								Login / Signup
							</a>
						</div>
					)}

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

					{currentUser && (
						<CiShoppingCart size={34} onClick={() => { closeMobileMenu(); navigate("/cart"); }} style={{ cursor: "pointer", marginBottom: 16 }} />
					)}
					{/* Action Buttons */}
					<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
						<a
							href="/PartnerPopup"
							onClick={closeMobileMenu}
							className="flex items-center justify-center gap-3 py-4 px-5 bg-[#6a0822] text-white rounded-xl no-underline font-semibold text-[16px] shadow transition-transform duration-300 active:scale-95"
						>
							<span className="text-[20px]">🤝</span>
							Become a Partner
						</a>

						<a
							href="/"
							onClick={e => { closeMobileMenu(); handleLogout(e); }}
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