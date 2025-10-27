
// import { useEffect, useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Plus, ChevronDown, ChevronUp } from "lucide-react";
// import { AddEntityDialog } from "@/modules/budget/entity/AddEntityDialog";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchBudgetCategories } from "@/features/budget/budgetCategorySlice";
// // New import for the modal
// import { CategoryCardModal } from "./CategoryCardModal";

// export default function CategoryList({ BudgetAccount }) {
//   const dispatch = useDispatch();
//   const categories = useSelector((state) => state.budgetCategory.categories);

//   const [expandedCategories, setExpandedCategories] = useState({});
//   const [addEntityDialogOpen, setAddEntityDialogOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   // New state for modal
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedModalCategory, setSelectedModalCategory] = useState(null);

//   const toggleExpand = (categoryId) => {
//     setExpandedCategories((prev) => ({
//       ...prev,
//       [categoryId]: !prev[categoryId],
//     }));
//   };

//   const handleOpenAddEntity = (category) => {
//     setSelectedCategory(category);
//     setAddEntityDialogOpen(true);
//   };

//   // New function to handle card click
//   const handleOpenCategoryModal = (category) => {
//     setSelectedModalCategory(category);
//     setModalOpen(true);
//   };

//   useEffect(() => {
//     if (BudgetAccount?.accountId) {
//       dispatch(fetchBudgetCategories(BudgetAccount.accountId));
//     }
//   }, [BudgetAccount?.accountId, dispatch]);

//   return (
//     <div className="space-y-4">
//       {categories && categories.length > 0 ? (
//         categories.map((category) => {
//           const isExpanded = expandedCategories[category._id] || false;
//           const entityCount = category.entityIds?.length || 0;

//           return (
//             <Card
//             className="cursor-pointer"
//               key={category._id}
//               onClick={() => handleOpenCategoryModal(category)} // Added onClick to open modal
//             >
//               <CardHeader>
//                 <div className="flex items-start justify-between">
//                   <div className="flex-1">
//                     <CardTitle>{category.name}</CardTitle>
//                   </div>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={(e) => {
//                       e.stopPropagation(); // Prevent card click from triggering modal
//                       handleOpenAddEntity(category);
//                     }}
//                   >
//                     <Plus className="h-4 w-4 mr-1" />
//                     Add Entity
//                   </Button>
//                 </div>
//               </CardHeader>

//               {entityCount >= 0 && (
//                 <CardContent>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="w-full justify-between"
//                     onClick={(e) => {
//                       e.stopPropagation(); // Prevent card click from triggering modal
//                       toggleExpand(category._id);
//                     }}
//                   >
//                     <span>{entityCount} Entities</span>
//                     {isExpanded ? (
//                       <ChevronUp className="h-4 w-4" />
//                     ) : (
//                       <ChevronDown className="h-4 w-4" />
//                     )}
//                   </Button>
//                   {isExpanded && (
                
//                     <div className="mt-2 space-y-2">
//   {category.entityIds
//     .slice(-2) // last 2 items
//     .map((entityId) => (
//       <div
//         key={entityId}
//         className="flex items-center justify-between p-2 rounded-md bg-muted/50"
//       >
     
//         <p className="text-sm">{category?.name}</p>
//         <Badge variant="secondary">Entity</Badge>
//       </div>
//     ))}

//   {category.entityIds.length > 2 && (
//     <div className="flex justify-end">
//       <p className="text-xs text-gray-500">more</p>
//     </div>
//   )}
// </div>

//                   )}
//                 </CardContent>
//               )}
//             </Card>
//           );
//         })
//       ) : (
//         <p className="text-sm text-muted-foreground">No categories available.</p>
//       )}

//       {selectedCategory && (
//         <AddEntityDialog
//           BudgetAccount={BudgetAccount}
//           open={addEntityDialogOpen}
//           onOpenChange={setAddEntityDialogOpen}
//           categoryId={selectedCategory.categoryId}
//           categoryName={selectedCategory.name}
//         />
//       )}

//       {/* New CategoryCardModal */}
//       {selectedModalCategory && (
//         <CategoryCardModal
//           BudgetAccount={BudgetAccount}
//           categoryId={selectedModalCategory.categoryId}
//           open={modalOpen}
//           onOpenChange={setModalOpen}
          
//         />
//       )}
//     </div>
//   );
// }













// "use client";

// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchBudgetCategories } from "@/features/budget/budgetCategorySlice";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Plus, Edit } from "lucide-react";
// import { AddEntityDialog } from "@/modules/budget/entity/AddEntityDialog";
// import { EditCategoryDialog } from "@/modules/budget/category/EditCategoryDialog";
// import { CategoryCardModal } from "./CategoryCardModal";
// import { format } from "date-fns";

// export default function CategoryList({ BudgetAccount }) {
//   const dispatch = useDispatch();
//   const categories = useSelector((state) => state.budgetCategory.categories);

//   const [addEntityDialogOpen, setAddEntityDialogOpen] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);

//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [editCategoryId, setEditCategoryId] = useState(null);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedModalCategory, setSelectedModalCategory] = useState(null);

//   const handleOpenAddEntity = (category) => {
//     setSelectedCategory(category);
//     setAddEntityDialogOpen(true);
//   };

//   const handleOpenEditCategory = (category) => {
//     setEditCategoryId(category.categoryId);
//     setEditDialogOpen(true);
//   };

//   const handleOpenCategoryModal = (category) => {
//     setSelectedModalCategory(category);
//     setModalOpen(true);
//   };

//   useEffect(() => {
//     if (BudgetAccount?.accountId) {
//       dispatch(fetchBudgetCategories(BudgetAccount.accountId));
//     }
//   }, [BudgetAccount?.accountId, dispatch]);

//   return (
//     <div className="rounded-md border w-full overflow-auto shadow-sm">
//       {categories && categories.length > 0 ? (
//         <Table className="min-w-full">
//           <TableHeader className="bg-gray-100">
//             <TableRow>
//               <TableHead>Category Name</TableHead>
//               <TableHead>Entity Count</TableHead>
//               <TableHead>isActive</TableHead>
//               <TableHead>Created At</TableHead>
//               <TableHead>Actions</TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>
//             {categories
//               .slice()
//               .reverse()
//               .map((category) => {
//                 const entityCount = category.entityIds?.length || 0;

//                 return (
//                   <TableRow
//                     key={category.categoryId}
//                     className="cursor-pointer hover:bg-gray-50 transition relative group"
//                     title={category.name}
//                     onClick={() => handleOpenCategoryModal(category)} // ✅ Clicking row opens modal
//                   >
//                     <TableCell className="font-medium text-gray-700">
//                       {category.name}
//                     </TableCell>
//                     <TableCell>{entityCount}</TableCell>
//                     <TableCell>
//                       {category.isActive ? (
//                         <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
//                           Active
//                         </span>
//                       ) : (
//                         <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
//                           Inactive
//                         </span>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       {category.createdAt
//                         ? format(new Date(category.createdAt), "dd MMM yyyy")
//                         : "-"}
//                     </TableCell>

//                     {/* Action Buttons */}
//                     <TableCell
//                       className="flex items-center gap-2 "
//                       onClick={(e) => e.stopPropagation()} // prevent triggering row click
//                     >
//                       {/* Add Entity (always visible) */}
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleOpenAddEntity(category)}
//                         title="Add a new entity to this category"
//                       >
//                         <Plus className="h-4 w-4 mr-1" /> Add Entity
//                       </Button>

//                       {/* Edit (only on hover) */}
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleOpenEditCategory(category)}
//                         title="Edit this category"
//                       >
//                         <Edit className="h-4 w-4 mr-1" /> Edit
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })}
//           </TableBody>
//         </Table>
//       ) : (
//         <p className="text-sm text-muted-foreground p-4">
//           No categories available.
//         </p>
//       )}

//       {/* Add Entity Dialog */}
//       {selectedCategory && (
//         <AddEntityDialog
//           BudgetAccount={BudgetAccount}
//           open={addEntityDialogOpen}
//           onOpenChange={setAddEntityDialogOpen}
//           categoryId={selectedCategory.categoryId}
//           categoryName={selectedCategory.name}
//         />
//       )}

//       {/* Edit Category Dialog */}
//       {editCategoryId && (
//         <EditCategoryDialog
//           BudgetAccount={BudgetAccount}
//           open={editDialogOpen}
//           onOpenChange={setEditDialogOpen}
//           categoryId={editCategoryId}
//         />
//       )}

//       {/* Category Card Modal (on row click) */}
//       {selectedModalCategory && (
//         <CategoryCardModal
//           BudgetAccount={BudgetAccount}
//           categoryId={selectedModalCategory.categoryId}
//           open={modalOpen}
//           onOpenChange={setModalOpen}
//         />
//       )}
//     </div>
//   );
// }



"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBudgetCategories } from "@/features/budget/budgetCategorySlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit } from "lucide-react";
import { AddEntityDialog } from "@/modules/budget/entity/AddEntityDialog";
import { EditCategoryDialog } from "@/modules/budget/category/EditCategoryDialog";
import { CategoryCardModal } from "./CategoryCardModal";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CategoryList({ BudgetAccount }) {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.budgetCategory.categories);

  const [addEntityDialogOpen, setAddEntityDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedModalCategory, setSelectedModalCategory] = useState(null);

  const handleOpenAddEntity = (category) => {
    setSelectedCategory(category);
    setAddEntityDialogOpen(true);
  };

  const handleOpenEditCategory = (category) => {
    setEditCategoryId(category.categoryId);
    setEditDialogOpen(true);
  };

  const handleOpenCategoryModal = (category) => {
    setSelectedModalCategory(category);
    setModalOpen(true);
  };

  useEffect(() => {
    if (BudgetAccount?.accountId) {
      dispatch(fetchBudgetCategories(BudgetAccount.accountId));
    }
  }, [BudgetAccount?.accountId, dispatch]);

  return (
    <div className="w-full p-6">
      {categories && categories.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories
            .slice()
            .reverse()
            .map((category) => {
              const entityCount = category.entityIds?.length || 0;
              const isActive = category.isActive;

              return (
                <Card
                  key={category.categoryId}
                  className={`relative cursor-pointer border border-gray-200 rounded-md shadow-sm bg-gradient-to-br ${
                    isActive
                      ? "from-green-50 via-white to-green-100/50"
                      : "from-red-50 via-white to-red-100/50"
                  } transition-none`}
                  onClick={() => handleOpenCategoryModal(category)}
                  title={category.name}
                >
                  {/* Top Action Buttons */}
                  <div
                    className="absolute top-2 right-2 flex items-center gap-2 z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenAddEntity(category)}
                            className="bg-green-100 hover:bg-green-100"
                          >
                            <Plus className="h-4 w-4 text-green-700" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add Entity</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEditCategory(category)}
                            className="bg-blue-100 hover:bg-blue-100"
                          >
                            <Edit className="h-4 w-4 text-blue-700" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit Category</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {/* Card Header */}
                  <CardHeader className="pb-0">
                    <CardTitle className="text-lg font-semibold text-gray-800 pr-10 truncate">
                      {category.name}
                    </CardTitle>
                  </CardHeader>

                  {/* Card Body */}
                  <CardContent className="pt-3 space-y-3">
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>Entities</span>
                      <span className="font-semibold text-gray-800">
                        {entityCount}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span>Status</span>
                      {isActive ? (
                        <span className="px-2 py-0.5 bg-green-200 text-green-800 rounded-md text-xs font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-200 text-red-800 rounded-md text-xs font-medium">
                          Inactive
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Created</span>
                      <span>
                        {category.createdAt
                          ? format(new Date(category.createdAt), "dd MMM yyyy")
                          : "-"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground p-4">
          No categories available.
        </p>
      )}

      {/* Add Entity Dialog */}
      {selectedCategory && (
        <AddEntityDialog
          BudgetAccount={BudgetAccount}
          open={addEntityDialogOpen}
          onOpenChange={setAddEntityDialogOpen}
          categoryId={selectedCategory.categoryId}
          categoryName={selectedCategory.name}
        />
      )}

      {/* Edit Category Dialog */}
      {editCategoryId && (
        <EditCategoryDialog
          BudgetAccount={BudgetAccount}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          categoryId={editCategoryId}
        />
      )}

      {/* Category Modal */}
      {selectedModalCategory && (
        <CategoryCardModal
          BudgetAccount={BudgetAccount}
          categoryId={selectedModalCategory.categoryId}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      )}
    </div>
  );
}
