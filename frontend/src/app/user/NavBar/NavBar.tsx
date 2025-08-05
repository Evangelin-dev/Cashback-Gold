import { ChevronDown, Facebook, Instagram, Linkedin, X as LucideX, Mail, Phone, ShoppingCart, User, Youtube } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CiShoppingCart } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../store";
import CustomImage from "../../components/custom/Image";
import { logoutUser } from "../../features/slices/authSlice";

export const MENU = [
	{ name: "Home", link: "/" },
	{ name: "About Us", link: "/aboutus" },
	{ name: "Buy Ornaments", link: "buyornaments" },
	{ name: "Contact Us", link: "/contactus" },
];

const NavBar = () => {
	const [selected, setSelected] = useState<string | null>(null);
	const [hovered, setHovered] = useState<string | null>(null);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(false);
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
	const navigate = useNavigate();
	const { currentUser } = useSelector((state: RootState) => state.auth);
	const dispatch = useDispatch<AppDispatch>();

	const cartItems = useSelector((state: RootState) => state.cart.items);
	const cartLength = cartItems.length;
	console.log(cartLength,'aa')

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
			{/* Top bar */}
			<div className="w-full bg-[#6a0822] border-b border-white flex items-center justify-between fixed top-0 left-0 right-0 z-[1100] h-8 md:h-10 px-2 md:px-6 text-xs md:text-sm">
				<div className="flex items-center gap-2 md:gap-5 flex-1 min-w-0">
					<span className="flex items-center gap-1 text-white min-w-0">
						<Phone className="w-4 h-4 md:w-5 md:h-5 mr-1" />
						<span className="font-semibold text-xs md:text-sm truncate">+91 81900 59995</span>
					</span>
					{!isMobile && (
						<span className="flex items-center gap-2 border-l border-white pl-3 min-w-0 text-white">
							<Mail className="w-5 h-5 mr-1" />
							<span className="font-semibold text-xs md:text-sm truncate">support@greenheapgold.com</span>
						</span>
					)}
				</div>
				<div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
					<a href="#" className="text-white"><Facebook className="w-4 h-4 md:w-5 md:h-5" /></a>
					<a href="#" className="text-white"><Instagram className="w-4 h-4 md:w-5 md:h-5" /></a>
					<a href="#" className="text-white"><LucideX className="w-4 h-4 md:w-5 md:h-5" /></a>
					{!isMobile && (
						<>
							<a href="#" className="text-white"><Youtube className="w-5 h-5" /></a>
							<a href="#" className="text-white"><Linkedin className="w-5 h-5" /></a>
						</>
					)}
				</div>
			</div>
			{/* Main nav, LNavBar style */}
			<nav className={`fixed left-0 right-0 z-30 w-full border-b border-red-100/50 transition-all duration-300 ease-in-out top-8 md:top-10 bg-white shadow-md`}>
				<div className="max-w-[1200px] mx-auto flex items-center justify-between px-2 md:px-6 w-full relative h-12">
					{/* Logo & All Categories */}
					<div className="flex items-center gap-2 md:gap-4 min-w-[50px]">
						<a href="/" className="flex items-center min-w-[32px] md:min-w-[40px]">
							<CustomImage src={"/logo.png"} wrapperClss="h-auto w-[32px] md:w-[40px] min-w-[32px] md:min-w-[40px]" height="auto" width={isMobile ? "32px" : "40px"} />
						</a>
						<button
							type="button"
							onClick={() => setHovered(hovered === "categories" ? null : "categories")}
							onMouseEnter={() => setHovered("categories")}
							className={`flex items-center gap-1 px-2 py-1 rounded-md font-semibold text-xs text-[#6a0822] bg-white border border-[#6a0822] hover:bg-[#6a0822] hover:text-white transition-all duration-200 focus:outline-none whitespace-nowrap`}
						>
							All Categories
							<ChevronDown size={12} className={`ml-1 transition-transform duration-200 ${hovered === "categories" ? "rotate-180" : "rotate-0"}`} />
						</button>
						{hovered === "categories" && (
							<div
								className="absolute left-0 top-12 bg-white rounded-xl shadow-lg border border-gray-200 w-[220px] md:w-[400px] z-50 p-2 md:p-4"
								onMouseLeave={() => setHovered(null)}
							>
								<h3 className="text-xs md:text-base font-semibold text-[#6a0822] mb-1 md:mb-2">Browse by Category</h3>
								<div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
									{[
										{ name: "Gold", subcategories: ["Men", "Women", "Kids", "Unisex"] },
										{ name: "Silver", subcategories: ["Men", "Women", "Kids", "Unisex"] },
										{ name: "Gold coin", subcategories: ["22k coin", "24k coin"] },
									].map((category) => (
										<div key={category.name} className="bg-gray-50 rounded-lg p-2 md:p-3 border border-gray-200">
											<h4 className="text-xs font-bold text-[#6a0822] mb-1 md:mb-2">{category.name}</h4>
											<div className="flex flex-col gap-1">
												{category.subcategories.map((sub) => (
													<a
														key={sub}
														href={`/category/${category.name.toLowerCase()}/${sub.toLowerCase()}`}
														className="text-xs text-gray-700 hover:text-[#6a0822] hover:underline px-1.5 py-0.5 rounded transition-all"
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
					{/* Main menu and actions */}
					<div className="flex flex-1 items-center justify-center">
						{/* Main menu */}
						{!isMobile && (
							<ul className="flex items-center gap-2 md:gap-3 m-0 p-0 list-none text-xs font-medium bg-slate-50/80 rounded-2xl py-1 px-2 backdrop-blur border border-slate-200/80">
								{MENU.map((menuItem) => (
									<li key={menuItem.name}>
										<a
											href={menuItem.link}
											onClick={() => setSelected(menuItem.name)}
											onMouseEnter={() => setHovered(menuItem.name)}
											onMouseLeave={() => setHovered(null)}
											className={`flex items-center gap-1 px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all duration-300 ${selected === menuItem.name || hovered === menuItem.name ? 'bg-[#6a0822] text-white shadow-lg -translate-y-0.5' : 'bg-transparent text-gray-700'}`}
											style={
												selected === menuItem.name || hovered === menuItem.name
													? { background: '#6a0822', color: '#fff' }
													: {}
											}
										>
											{menuItem.name}
										</a>
									</li>
								))}
							</ul>
						)}
					</div>
					{/* Right-side Actions & Mobile Menu Toggle */}
					<div className="flex items-center gap-2 md:gap-3 ml-auto">
						{/* Become a partner button always visible */}
						<a
							href="/PartnerPopup"
							className="bg-[#7a1335] text-white rounded px-2 py-1 font-semibold text-xs whitespace-nowrap cursor-pointer transition-colors duration-200 hover:bg-[#8a2342]"
						>
							Become a partner / Login
						</a>
						{currentUser && (
							<div className="relative">
								<button
									className=""
									onClick={() => navigate("/cart")}
									aria-label="Cart"
								>
									<CiShoppingCart size={18} />
								</button>
								
									<span className="absolute z-10 -top-3 -right-1 text-[10px] min-w-[16px] h-[16px] px-1 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md">
										{cartLength}
									</span>
								
							</div>
						)}
						{currentUser ? (
							<div className="relative" ref={userMenuRef}>
								<button
									type="button"
									onClick={() => setIsUserMenuOpen(prev => !prev)}
									className="flex h-9 w-9 items-center justify-center rounded-full bg-white border-2 border-slate-200 text-[#6a0822] transition-all shadow cursor-pointer relative z-[1001] hover:bg-[#6a0822] hover:text-white"
								>
									<div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[#6a0822] font-bold text-[13px]">
										<User size={18} />
									</div>
								</button>
								{isUserMenuOpen && (
									<div className="absolute top-full right-0 mt-2 w-44 rounded-lg border border-gray-200 bg-white shadow-lg z-50 animate-slideIn">
										<div className="bg-[#6a0822] p-3 text-center relative rounded-t-lg">
											<div className="w-10 h-10 rounded-full bg-slate-200 mx-auto mb-2 flex items-center justify-center text-[18px] border-2 border-white/20">
												<User size={20} />
											</div>
											<h3 className="text-white text-[13px] font-semibold mb-1">{currentUser?.email || ""}</h3>
											<p className="text-white/80 text-[11px] m-0">{currentUser?.role || ""} Member</p>
										</div>
										<div className="p-2">
											{currentUser.role === 'USER' && (
												<Link to="/user" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-2 py-2 rounded-md text-[12px] font-medium transition-all duration-200 mb-1 text-slate-700 hover:bg-[#6a0822]/10 hover:text-[#6a0822] hover:translate-x-1"><User size={14} />My Account</Link>
											)}
											{currentUser.role === 'B2B' && (
												<Link to="/bdashboard" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-2 py-2 rounded-md text-[12px] font-medium transition-all duration-200 mb-1 text-slate-700 hover:bg-[#6a0822]/10 hover:text-[#6a0822] hover:translate-x-1"><User size={14} />B2B Dashboard</Link>
											)}
											{currentUser.role === 'PARTNER' && (
												<Link to="/pdashboard" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-2 px-2 py-2 rounded-md text-[12px] font-medium transition-all duration-200 mb-1 text-slate-700 hover:bg-[#6a0822]/10 hover:text-[#6a0822] hover:translate-x-1"><User size={14} />PARTNER Dashboard</Link>
											)}
											<button onClick={handleLogout} className="flex items-center gap-2 px-2 py-2 rounded-md text-[12px] font-medium transition-all duration-200 mb-1 text-red-500 hover:bg-red-100 hover:translate-x-1 w-full text-left bg-none border-none cursor-pointer"><LucideX size={14} />Logout</button>
										</div>
									</div>
								)}
							</div>
						) : (
							<a
								href="/SignupPopup"
								className="text-[#8a2342] font-bold text-xs px-2 py-1 rounded bg-transparent border border-transparent cursor-pointer"
							>
								Login / Signup
							</a>
						)}
						{/* Mobile Menu Button */}
						{isMobile && (
							<button
								type="button"
								onClick={toggleMobileMenu}
								aria-label="Toggle mobile menu"
								aria-expanded={isMobileMenuOpen}
								className="bg-transparent border-none cursor-pointer p-1 flex flex-col gap-0.5 items-center justify-center w-9 h-9"
							>
								<span className={`w-6 h-0.5 bg-[#7a1335] transition-all ${isMobileMenuOpen ? "rotate-45 translate-y-1" : ""}`}></span>
								<span className={`w-6 h-0.5 bg-[#7a1335] transition-all ${isMobileMenuOpen ? "opacity-0" : ""}`}></span>
								<span className={`w-6 h-0.5 bg-[#7a1335] transition-all ${isMobileMenuOpen ? "-rotate-45 -translate-y-1" : ""}`}></span>
							</button>
						)}
					</div>
				</div>
				{/* Mobile Menu Dropdown, LNavBar style */}
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
												color: selected === menuItem.name ? "#fff" : "#374151",
												background: selected === menuItem.name ? "#6a0822" : "rgba(248, 250, 252, 0.8)",
												fontWeight: selected === menuItem.name ? 700 : 500,
												textDecoration: "none", padding: "12px 16px", display: "block",
												borderRadius: 12, transition: "all 0.18s", cursor: "pointer",
												border: selected === menuItem.name ? "1px solid #6a0822" : "1px solid rgba(226,232,240,0.8)",
												boxShadow: selected === menuItem.name ? "0 4px 16px rgba(106, 8, 34, 0.3)" : "0 2px 8px rgba(0,0,0,0.05)"
											}}
										>
											{menuItem.name}
										</a>
									</li>
								))}
							</ul>
							<div className="mt-4 flex flex-col gap-3 border-t pt-4">
								{/* Mobile Action Buttons */}
								<a href="/PartnerPopup" className="w-full rounded-lg bg-[#7a1335] px-4 py-3 text-center font-medium text-white">Become a partner / Login</a>
								{currentUser ? (
									<>
										<Link to="/user" onClick={() => setIsMobileMenuOpen(false)} className="w-full rounded-lg bg-gray-100 px-4 py-3 text-center font-bold text-[#6a0822]">My Account</Link>
										<button onClick={handleLogout} className="w-full rounded-lg border border-[#6a0822] px-4 py-3 text-center font-bold text-[#6a0822]">Logout</button>
									</>
								) : (
									<>
										<a href="/b2bregister" className="w-full rounded-lg border border-[#8a2342] px-4 py-3 text-center font-bold text-[#8a2342]">B2B Register</a>
										<a href="/SignupPopup" className="w-full rounded-lg border border-[#6a0822] px-4 py-3 text-center font-bold text-[#6a0822]">User Login / Signup</a>
									</>
								)}
							</div>
						</div>
					</div>
				)}
			</nav>
		</>);
}

export default NavBar;