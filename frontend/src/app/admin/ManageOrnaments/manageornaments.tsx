import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store";
import axiosInstance from "../../../utils/axiosInstance";

import { setCurrentPage } from "../../features/slices/adminSlice";
import {
  addOrnament,
  deleteOrnament,
  fetchAllOrnaments,
  updateOrnament,
  type OrnamentApiData,
} from "../../features/thunks/adminThunks";
import type { Ornament } from "../../types/type";

const CATEGORY_TREE = [
  {
    name: "Indian Gold",
    children: [
      { name: "Men", items: ["Bracelets", "Rings", "Necklaces", "Cufflinks", "Earrings", "Tie"] },
      { name: "Women", items: ["Earrings", "Rings", "Necklaces", "Bracelets", "Bangles"] },
      { name: "Kid", items: ["Earrings", "Rings", "Necklaces", "Bracelets", "Bangles"] },
      { name: "Unisex", items: ["Earrings", "Rings", "Necklaces", "Bracelets", "Bangles", "Cufflinks", "Tie"] },
      { name: "Gold Coin", items: [{ name: "22k Gold Coin", items: ["1g", "2g", "5g", "10g"] }, { name: "24k Gold Coin", items: ["1g", "2g", "5g", "10g"] }] }
    ]
  },
  {
    name: "Dubai Gold",
    children: [
      { name: "Men", items: ["Bracelets", "Rings", "Necklaces", "Cufflinks", "Earrings", "Tie"] },
      { name: "Women", items: ["Earrings", "Rings", "Necklaces", "Bracelets", "Bangles"] },
      { name: "Kid", items: ["Earrings", "Rings", "Necklaces", "Bracelets", "Bangles"] },
      { name: "Unisex", items: ["Earrings", "Rings", "Necklaces", "Bracelets", "Bangles", "Cufflinks", "Tie"] },
      { name: "Gold Coin", items: [{ name: "22k Gold Coin", items: ["1g", "2g", "5g", "10g"] }, { name: "24k Gold Coin", items: ["1g", "2g", "5g", "10g"] }] }
    ]
  }
];

const emptyFormState = {
  id: null,
  name: "",
  totalGram: "", // total gram
  gramPrice: "", // per gram price
  totalPrice: "", // calculated
  material: "",
  purity: "",
  quality: "",
  description: "",
  description1: "",
  description2: "",
  description3: "",
  priceBreakups: [],
  warranty: "",
  warrantyYears: "",
  details: "",
  itemType: "", // Keep itemType for edit logic
};

const emptyBreakup = { component: "", goldRate18kt: "", netWeight: "", grossWeight: "", discount: "", finalValue: "" };

const ManageOrnaments: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { ornaments, status, error, currentPage, totalPages, pageSize } = useSelector((state: RootState) => state.admin);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [form, setForm] = useState<any>(emptyFormState);
  const [goldPrice, setGoldPrice] = useState<string>("");
  const [loadingGoldPrice, setLoadingGoldPrice] = useState(false);
  const [goldPriceError, setGoldPriceError] = useState<string | null>(null);
  const [showPriceBreakup, setShowPriceBreakup] = useState(false);

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [subImageFiles, setSubImageFiles] = useState<(File | null)[]>(Array(4).fill(null));
  const [imagePreviews, setImagePreviews] = useState({ main: "", subs: Array(4).fill("") });

  // --- RESTORED STATE FOR OLD DROPDOWNS ---
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [item, setItem] = useState("");
  const [customItem, setCustomItem] = useState("");

  useEffect(() => {
    dispatch(fetchAllOrnaments({ page: currentPage, size: pageSize }));
  }, [currentPage, dispatch, pageSize]);

  useEffect(() => {
    const fetchGold = async () => {
      setLoadingGoldPrice(true);
      setGoldPriceError(null);
      try {
        const response = await axiosInstance.get('/api/metal-rates');
        const { goldRateInrPerGram } = response.data;
        setGoldPrice(goldRateInrPerGram.toFixed(2));
        setForm((prev: any) => ({ ...prev, gramPrice: goldRateInrPerGram.toFixed(2) }));
      } catch (err) {
        setGoldPriceError("Failed to fetch gold price");
      } finally {
        setLoadingGoldPrice(false);
      }
    };
    fetchGold();
  }, []);

  const resetAndHideForm = () => {
    setForm(emptyFormState);
    setMainImageFile(null);
    setSubImageFiles(Array(4).fill(null));
    setImagePreviews({ main: "", subs: Array(4).fill("") });
    setShowPriceBreakup(false);
    // Reset dropdown states
    setMainCategory("");
    setSubCategory("");
    setItem("");
    setCustomItem("");
    setIsFormVisible(false);
  };

  const handleAddNew = () => {
    resetAndHideForm();
    setIsFormVisible(true);
    // Set gramPrice to latest fetched gold price
    setForm((prev: any) => ({ ...prev, gramPrice: goldPrice }));
  };

  const handleEdit = (product: Ornament) => {
    setIsFormVisible(true);
    setForm({
      ...product,
      totalGram: product.totalGram ? product.totalGram.toString() : "",
      gramPrice: goldPrice,
      warranty: product.warranty?.includes('years') ? 'other' : product.warranty,
      warrantyYears: product.warranty?.includes('years') ? product.warranty.match(/\d+/)?.[0] || '' : '',
    });

    // --- LOGIC TO POPULATE DROPDOWNS FROM API DATA ---
    setMainCategory(product.category);
    setSubCategory(product.subCategory);

    const subCatOptions = CATEGORY_TREE.find(c => c.name === product.category)?.children || [];
    const itemOptionsForSubCat = (subCatOptions.find(sc => sc.name === product.subCategory)?.items as any[]) || [];
    const itemExistsInList = itemOptionsForSubCat.some(i => (typeof i === 'string' ? i : i.name) === product.itemType);
    if (product.itemType && itemExistsInList) {
      setItem(product.itemType);
      setCustomItem("");
    } else if (product.itemType) {
      setItem("Other");
      setCustomItem(product.itemType);
    } else {
      setItem("");
      setCustomItem("");
    }
    setImagePreviews({
      main: product.mainImage,
      subs: product.subImages ? [...product.subImages, ...Array(4 - product.subImages.length).fill("")] : Array(4).fill("")
    });
    setShowPriceBreakup(false);
    window.scrollTo(0, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "warranty" && value !== "other") {
      setForm({ ...form, warranty: value, warrantyYears: "" });
    } else if (name === "totalGram") {
      // When grams change, recalculate totalPrice
      setForm((prev: any) => ({
        ...prev,
        totalGram: value,
        totalPrice: value && prev.gramPrice ? (parseFloat(value) * parseFloat(prev.gramPrice)).toFixed(2) : ""
      }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    if (index === undefined) {
      setMainImageFile(file);
      setImagePreviews(p => ({ ...p, main: previewUrl }));
    } else {
      setSubImageFiles(f => { const newFiles = [...f]; newFiles[index] = file; return newFiles; });
      setImagePreviews(p => { const newSubs = [...p.subs]; newSubs[index] = previewUrl; return { ...p, subs: newSubs }; });
    }
  };

  const handleProductFormSave = () => {
    const required = ["name", "totalGram", "material", "purity", "quality", "details"];
    for (const key of required) {
      if (!form[key] || String(form[key]).trim() === "") {
        alert(`Please fill the required field: ${key}`);
        return;
      }
    }
    // Validate dropdowns
    if (!mainCategory || !subCategory || !item || (item === "Other" && !customItem.trim())) {
      alert("Please select all category levels and specify the item.");
      return;
    }
    if (!form.id && !mainImageFile) {
      alert("Main image is required for a new ornament.");
      return;
    }
    setShowPriceBreakup(true);
  };

  const handleFinalSave = async () => {
    if (form.priceBreakups.length === 0) { alert("At least one price breakup row is required."); return; }
    for (const breakup of form.priceBreakups) {
      for (const key in breakup) {
        if (!breakup[key] || String(breakup[key]).trim() === "") { alert("Please fill all fields in all price breakup rows."); return; }
      }
    }

    const warrantyValue = form.warranty === 'other' ? `${form.warrantyYears} years` : form.warranty;

    // --- CONSTRUCT PAYLOAD FROM DROPDOWN STATES ---
    const totalGramValue = parseFloat(form.totalGram);
    const data: OrnamentApiData = {
      name: form.name,
      totalGram: totalGramValue,
      price: totalGramValue, // legacy field for backend compatibility
      gramPrice: form.gramPrice ? parseFloat(form.gramPrice as any) : undefined, // per gram price
      totalPrice: form.totalGram && form.gramPrice ? totalGramValue * parseFloat(form.gramPrice as any) : undefined, // calculated
      category: mainCategory,
      subCategory: subCategory,
      gender: subCategory, // The subCategory (Men, Women, etc.) maps to gender
      itemType: item === "Other" ? customItem : item,
      description1: form.description1,
      description2: form.description2,
      description3: form.description3,
      description: form.description,
      material: form.material,
      purity: form.purity,
      quality: form.quality,
      warranty: warrantyValue,
      details: form.details,
      priceBreakups: form.priceBreakups.map((p: any) => ({
        component: p.component, goldRate18kt: parseFloat(p.goldRate18kt), netWeight: parseFloat(p.netWeight), grossWeight: parseFloat(p.grossWeight), discount: parseFloat(p.discount), finalValue: parseFloat(p.finalValue)
      }))
    };

    const filteredSubImages = subImageFiles.filter(f => f) as File[];

    try {
      if (form.id) {
        await dispatch(updateOrnament({ id: form.id, data, mainImage: mainImageFile, subImages: filteredSubImages })).unwrap();
        alert("Ornament updated successfully!");
      } else {
        if (!mainImageFile) { alert("Main image is required."); return; }
        await dispatch(addOrnament({ data, mainImage: mainImageFile, subImages: filteredSubImages })).unwrap();
        alert("Ornament added successfully!");
      }
      resetAndHideForm();
      dispatch(fetchAllOrnaments({ page: currentPage, size: pageSize }));
    } catch (err: any) {
      alert(`Error: ${err.message || 'An unknown error occurred'}`);
    }
  };

  const handleDelete = async (id: number) => { if (window.confirm("Are you sure?")) { try { await dispatch(deleteOrnament(id)).unwrap(); alert("Ornament deleted."); dispatch(fetchAllOrnaments({ page: currentPage, size: pageSize })); } catch (err: any) { alert(`Error: ${err.message || 'An unknown error occurred'}`); } } };
  const handleBreakupChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => { const { name, value } = e.target; const updatedBreakups = form.priceBreakups.map((item: any, i: number) => i === index ? { ...item, [name]: value } : item); setForm({ ...form, priceBreakups: updatedBreakups }); };
  const addBreakupRow = () => { setForm((f: any) => ({ ...f, priceBreakups: [...f.priceBreakups, emptyBreakup] })); };
  const handleBreakupDelete = (idx: number) => { setForm((f: any) => ({ ...f, priceBreakups: f.priceBreakups.filter((_: any, i: number) => i !== idx) })); };
  const handlePageChange = (newPage: number) => { if (newPage >= 0 && newPage < totalPages) { dispatch(setCurrentPage(newPage)); } };

  // --- HELPER FUNCTIONS FOR RESTORED DROPDOWNS ---
  const subCategoryOptions = mainCategory ? CATEGORY_TREE.find(cat => cat.name === mainCategory)?.children || [] : [];
  const foundSubCategoryItems = subCategoryOptions.find(sub => sub.name === subCategory)?.items ?? [];
  const itemOptions = (foundSubCategoryItems as any[]).map(i => typeof i === 'string' ? i : i.name);
  if (subCategory && !itemOptions.includes("Other")) itemOptions.push("Other");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fbeaf0] to-white p-2 sm:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#7a1335]">Manage Ornaments</h1>
        {!isFormVisible && (<button onClick={handleAddNew} className="bg-[#7a1335] text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-[#a31d4b] transition">+ Add Ornament</button>)}
      </div>

      {isFormVisible && (
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">{form.id ? 'Edit Ornament' : 'Create New Ornament'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="mb-4">
                <label className="block font-semibold text-[#7a1335] mb-2">Main Image *</label>
                <div className="flex flex-col items-center gap-4 p-4 border-2 border-dashed border-[#7a1335] rounded-lg bg-[#fbeaf0]">
                  {imagePreviews.main && <img src={imagePreviews.main} alt="Main Preview" className="w-32 h-32 object-contain rounded-lg shadow" />}
                  <label className="w-full flex flex-col items-center">
                    <input type="file" name="mainImage" accept="image/*" onChange={handleFileChange} className="hidden" />
                    <button type="button" className="bg-[#7a1335] hover:bg-[#a31d4b] text-white font-bold py-2 px-6 rounded-lg shadow transition mt-2 flex items-center gap-2" onClick={e => (e.currentTarget.previousElementSibling as HTMLInputElement)?.click()}>Upload main image</button>
                  </label>
                </div>
              </div>
              <input type="text" name="name" placeholder="Name *" value={form.name} onChange={handleChange} className="mb-3 px-3 py-2 border rounded w-full" required />
              {/* Total Gram field (was Price) */}
              <input type="number" name="totalGram" placeholder="Total Gram *" value={form.totalGram} onChange={handleChange} className="mb-3 px-3 py-2 border rounded w-full" required />
              {/* Gram Price field from API (read-only) */}
              <input type="number" name="gramPrice" placeholder="Gram Price (from API) *" value={loadingGoldPrice ? "" : (form.gramPrice || '')} readOnly className="mb-3 px-3 py-2 border rounded w-full bg-gray-100" required />
              {goldPriceError && <div className="text-red-500 text-xs mb-2">{goldPriceError}</div>}
              {/* Total Price calculated field */}
              <input type="number" name="totalPrice" placeholder="Total Price (auto-calculated)" value={form.totalPrice || (form.totalGram && form.gramPrice ? (parseFloat(form.totalGram) * parseFloat(form.gramPrice)).toFixed(2) : '')} readOnly className="mb-3 px-3 py-2 border rounded w-full bg-gray-100" />

              {/* --- RESTORED DROPDOWN UI --- */}
              <div className="mb-3 flex flex-col gap-3 bg-[#fbeaf0] p-4 rounded-lg shadow-inner">
                <select name="mainCategory" value={mainCategory} onChange={e => { setMainCategory(e.target.value); setSubCategory(""); setItem(""); setCustomItem(""); }} className="px-3 py-2 border rounded w-full" required>
                  <option value="">Select Main Category *</option>
                  {CATEGORY_TREE.map(cat => (<option key={cat.name} value={cat.name}>{cat.name}</option>))}
                </select>
                {mainCategory && <select name="subCategory" value={subCategory} onChange={e => { setSubCategory(e.target.value); setItem(""); setCustomItem(""); }} className="px-3 py-2 border rounded w-full mt-2" required>
                  <option value="">Select Sub-Category *</option>
                  {subCategoryOptions.map(sub => (<option key={sub.name} value={sub.name}>{sub.name}</option>))}
                </select>}
                {subCategory && (
                  <>
                    <select name="item" value={item} onChange={e => { setItem(e.target.value); if (e.target.value !== "Other") setCustomItem(""); }} className="px-3 py-2 border rounded w-full mt-2" required>
                      <option value="">Select Item *</option>
                      {itemOptions.map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                    </select>
                    {item === "Other" && (<input type="text" name="customItem" value={customItem} onChange={e => setCustomItem(e.target.value)} placeholder="Enter custom item name" className="px-3 py-2 border rounded w-full mt-2" required />)}
                  </>
                )}
              </div>
            </div>

            <div>
              <input type="text" name="material" placeholder="Material *" value={form.material} onChange={handleChange} className="mb-3 px-3 py-2 border rounded w-full" required />
              <input type="text" name="purity" placeholder="Gold Purity *" value={form.purity} onChange={handleChange} className="mb-3 px-3 py-2 border rounded w-full" required />
              <input type="text" name="quality" placeholder="Quality *" value={form.quality} onChange={handleChange} className="mb-3 px-3 py-2 border rounded w-full" required />
              <input type="text" name="details" placeholder="Details *" value={form.details} onChange={handleChange} className="mb-3 px-3 py-2 border rounded w-full" required />
              <input type="text" name="description" placeholder="Description Title *" value={form.description} onChange={handleChange} className="mb-3 px-3 py-2 border rounded w-full" required />
              <input type="text" name="description1" placeholder="Description Point 1 *" value={form.description1} onChange={handleChange} className="mb-3 px-3 py-2 border rounded w-full" required />
              <input type="text" name="description2" placeholder="Description Point 2 *" value={form.description2} onChange={handleChange} className="mb-3 px-3 py-2 border rounded w-full" required />
              <input type="text" name="description3" placeholder="Description Point 3 *" value={form.description3} onChange={handleChange} className="mb-3 px-3 py-2 border rounded w-full" required />
            </div>

            <div>
              <label className="block font-semibold text-[#7a1335] mb-2">Gallery Images</label>
              <div className="grid grid-cols-2 gap-4">
                {subImageFiles.map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 p-3 border rounded-lg bg-[#fbeaf0]">
                    {imagePreviews.subs[i] && <img src={imagePreviews.subs[i]} alt={`Sub ${i}`} className="w-20 h-20 object-contain rounded border mb-2" />}
                    <label className="w-full flex flex-col items-center">
                      <input type="file" name={`subImage${i}`} accept="image/*" onChange={(e) => handleFileChange(e, i)} className="hidden" />
                      <button type="button" className="bg-[#7a1335] hover:bg-[#a31d4b] text-white font-semibold py-1 px-4 rounded transition mt-2 flex items-center gap-2" onClick={e => (e.currentTarget.previousElementSibling as HTMLInputElement)?.click()}>Upload</button>
                    </label>
                  </div>
                ))}
              </div>
              <div className="mb-3 mt-6">
                <label className="block font-semibold text-[#7a1335] mb-2">Warranty</label>
                <select name="warranty" value={form.warranty} onChange={handleChange} className="px-3 py-2 border rounded w-full" required>
                  <option value="">Select Warranty *</option><option value="lifetime">Lifetime warranty</option><option value="none">No warranty</option><option value="other">Other</option>
                </select>
              </div>
              {form.warranty === "other" && (<div className="mb-3"><label className="block font-semibold text-[#7a1335] mb-2">Warranty (years)</label><input type="number" name="warrantyYears" min={1} placeholder="Enter warranty in years" value={form.warrantyYears} onChange={handleChange} className="px-3 py-2 border rounded w-full" required /></div>)}
            </div>
          </div>

          {!showPriceBreakup ? (<div className="flex gap-4 mt-8"><button onClick={handleProductFormSave} className="bg-[#7a1335] text-white font-semibold py-2 px-6 rounded hover:bg-[#a31d4b]">Next</button><button onClick={resetAndHideForm} className="bg-gray-400 text-white font-semibold py-2 px-6 rounded hover:bg-gray-500">Cancel</button></div>) : (<div className="mt-10 border-t pt-8"><h3 className="text-xl font-bold text-[#7a1335] mb-4">Price Breakup</h3><div className="overflow-x-auto mb-6"><table className="min-w-full bg-white"><thead><tr className="border-b">
  <th className="px-4 py-2 text-left text-[#7a1335]">Product Details</th>
  <th className="px-4 py-2 text-left text-[#7a1335]">Rate</th>
  <th className="px-4 py-2 text-left text-[#7a1335]">Weight</th>
  <th className="px-4 py-2 text-left text-[#7a1335]">Discount</th>
  <th className="px-4 py-2 text-left text-[#7a1335]">Final Value</th>
  <th className="px-4 py-2 text-left text-[#7a1335]">Actions</th>
</tr></thead><tbody>{form.priceBreakups.map((row: any, i: number) => (
  <tr key={i} className="border-b">
    <td className="p-2"><input type="text" name="component" placeholder="Product Details *" value={row.component} onChange={e => handleBreakupChange(e, i)} className="w-full px-2 py-1 border rounded" /></td>
    <td className="p-2">
      <input
        type="number"
        name="goldRate18kt"
        placeholder="Rate *"
        value={row.goldRate18kt}
        onChange={e => handleBreakupChange(e, i)}
        className="w-full px-2 py-1 border rounded mb-1"
      />
    </td>
    <td className="p-2">
      {row.netWeight && row.grossWeight
        ? `${row.netWeight}g Net / ${row.grossWeight}g Gross`
        : row.netWeight
        ? `${row.netWeight}g Net`
        : row.grossWeight
        ? `${row.grossWeight}g Gross`
        : '-'}
      <div className="flex gap-2 mt-1">
        <input type="number" name="netWeight" placeholder="Net Weight (g)" value={row.netWeight} onChange={e => handleBreakupChange(e, i)} className="w-1/2 px-2 py-1 border rounded" />
        <input type="number" name="grossWeight" placeholder="Gross Weight (g)" value={row.grossWeight} onChange={e => handleBreakupChange(e, i)} className="w-1/2 px-2 py-1 border rounded" />
      </div>
    </td>
    <td className="p-2"><input type="number" name="discount" placeholder="Discount *" value={row.discount} onChange={e => handleBreakupChange(e, i)} className="w-full px-2 py-1 border rounded" /></td>
    <td className="p-2">
      <input
        type="number"
        name="finalValue"
        placeholder="Final Value *"
        value={
          row.netWeight && form.gramPrice
            ? (parseFloat(row.netWeight) * parseFloat(form.gramPrice)).toFixed(2)
            : row.grossWeight && form.gramPrice
            ? (parseFloat(row.grossWeight) * parseFloat(form.gramPrice)).toFixed(2)
            : row.finalValue
        }
        onChange={e => handleBreakupChange(e, i)}
        className="w-full px-2 py-1 border rounded mb-1"
      />
    </td>
    <td className="p-2 flex gap-2"><button onClick={() => handleBreakupDelete(i)} className="bg-red-500 text-white px-3 py-1 rounded text-xs">Delete</button></td>
  </tr>
))}</tbody></table></div><div className="flex gap-4"><button onClick={addBreakupRow} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded">Add Row</button></div><div className="flex gap-4 mt-8 border-t pt-6"><button onClick={handleFinalSave} disabled={status === 'loading'} className="bg-green-600 text-white font-semibold py-2 px-8 rounded disabled:bg-gray-400 disabled:cursor-not-allowed">{status === 'loading' ? 'Saving...' : (form.id ? 'Update Product' : 'Save Product')}</button><button onClick={() => setShowPriceBreakup(false)} className="bg-gray-500 text-white font-semibold py-2 px-6 rounded">Back</button></div></div>)}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-2xl p-8 mt-10">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Existing Ornaments</h2>
        {status === 'loading' && !ornaments.length && <p>Loading ornaments...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        <div className="space-y-4">{ornaments.map((product) => (<div key={product.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center p-4 border rounded-lg shadow-sm hover:bg-gray-50"><img src={product.mainImage} alt={product.name} className="w-20 h-20 object-cover rounded-md" /><p className="font-bold text-lg col-span-2 text-[#7a1335]">{product.name}</p><p className="text-gray-600 text-sm">{product.category} {">"} {product.subCategory} {">"} {product.itemType}</p><div className="flex gap-2 justify-end"><button onClick={() => handleEdit(product)} className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Edit</button><button onClick={() => handleDelete(product.id)} disabled={status === 'loading'} className="bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-700 disabled:bg-gray-400">Delete</button></div></div>))}</div>
        <div className="flex justify-center items-center mt-8 gap-2"><button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0 || status === 'loading'} className="px-4 py-2 bg-[#7a1335] text-white rounded disabled:bg-gray-300">Prev</button><span className="font-semibold">Page {currentPage + 1} of {totalPages}</span><button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1 || status === 'loading'} className="px-4 py-2 bg-[#7a1335] text-white rounded disabled:bg-gray-300">Next</button></div>
      </div>
    </div>
  );
};

export default ManageOrnaments;