
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BackToAdminButton from '@/components/admin/BackToAdminButton';
import { format } from 'date-fns';
import { Trash2, Search, Archive } from 'lucide-react';
import { secureApi } from '@/hooks/axios/useAxios';

const AdminDeletedPlansArchive = () => {
  const { user, isAdmin, isManager } = useAuth();
  const navigate = useNavigate();
  const [deletedPlans, setDeletedPlans] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPlans, setFilteredPlans] = useState([]);

  useEffect(() => {
    if (!user || (!isAdmin && !isManager)) {
      navigate('/login');
      return;
    }
  }, [user, isAdmin, isManager, navigate]);

  useEffect(() => {
    // Load deleted plans from localStorage
    const ArchivedPlans = async()=>{
      const { data } = await secureApi.get("/api/archivedPlans")
      console.log(data);
      
      setDeletedPlans( data );
      setFilteredPlans( data );
    } 
    ArchivedPlans()

  }, []);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      setFilteredPlans(
        deletedPlans.filter(item => 
          item.plan.name.toLowerCase().includes(query) || 
          item.plan.description.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredPlans(deletedPlans);
    }
  }, [deletedPlans, searchQuery]);

  const handlePermanentDelete = async(index) => {
    const updatedPlans = deletedPlans.filter((_) => _._id !== index);
    setDeletedPlans(updatedPlans);
    await secureApi.delete(`/api/archivedPlans/${index}`);
  };

  const clearAllArchive = async() => {
    setDeletedPlans([]);
    await secureApi.delete(`/api/archivedPlans`);
  };

  return (
      <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                  <h1 className="text-3xl font-bold mb-2 flex items-center">
                      <Archive className="w-8 h-8 mr-3" />
                      Deleted Plans Archive
                  </h1>
                  <p className="text-gray-600">
                      View data from deleted plans for safety and auditing
                      purposes
                  </p>
              </div>
              {deletedPlans.length > 0 && (
                  <Button
                      variant="destructive"
                      onClick={clearAllArchive}
                      className="mt-4 sm:mt-0"
                  >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All Archive
                  </Button>
              )}
          </div>

          <BackToAdminButton />

          {/* Search */}
          <div className="mb-8">
              <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                      placeholder="Search deleted plans..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                  />
              </div>
          </div>

          {/* Archive Content */}
          {filteredPlans.length === 0 ? (
              <Card>
                  <CardContent className="py-12 text-center">
                      <Archive className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                          {deletedPlans.length === 0
                              ? "No Deleted Plans"
                              : "No Plans Found"}
                      </h3>
                      <p className="text-gray-500">
                          {deletedPlans.length === 0
                              ? "When you delete plans, their data will be archived here for safety."
                              : "Try adjusting your search criteria."}
                      </p>
                  </CardContent>
              </Card>
          ) : (
              <div className="space-y-6">
                  {filteredPlans.map((item, index) => (
                      <Card key={index} className="border-red-200">
                          <CardHeader className="bg-red-50">
                              <CardTitle className="flex justify-between items-start">
                                  <div>
                                      <span className="text-red-800">
                                          {item.planDetails.name}
                                      </span>
                                      <Badge
                                          variant="destructive"
                                          className="ml-2"
                                      >
                                          Deleted
                                      </Badge>
                                  </div>
                                  <div className="text-right">
                                      <div className="text-lg font-semibold">
                                          ${item.planDetails.price.toFixed(2)}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                          Deleted:{" "}
                                          {format(
                                              new Date(item.createdAt),
                                              "MMM dd, yyyy HH:mm"
                                          )}
                                      </div>
                                  </div>
                              </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Plan Details */}
                                  <div>
                                      <h4 className="font-medium mb-3">
                                          Plan Details
                                      </h4>
                                      <div className="space-y-2 text-sm">
                                          <div>
                                              <span className="font-medium">
                                                  Description:
                                              </span>{" "}
                                              {item.planDetails.description}
                                          </div>
                                          <div>
                                              <span className="font-medium">
                                                  Duration:
                                              </span>{" "}
                                              {item.planDetails.durationValue}{" "}
                                              {item.planDetails.durationType}
                                          </div>
                                          {item.planDetails.stickerText && (
                                              <div>
                                                  <span className="font-medium">
                                                      Sticker:
                                                  </span>{" "}
                                                  {item.planDetails.stickerText}
                                              </div>
                                          )}
                                          <div>
                                              <span className="font-medium">
                                                  Homepage:
                                              </span>{" "}
                                              {item.planDetails.showOnHomepage
                                                  ? "Yes"
                                                  : "No"}
                                          </div>
                                          <div>
                                              <span className="font-medium">
                                                  Draft:
                                              </span>{" "}
                                              {item.planDetails.isDraft
                                                  ? "Yes"
                                                  : "No"}
                                          </div>
                                      </div>
                                  </div>

                                  {/* Related Orders */}
                                <div>
                                  <h4 className="font-medium mb-3">
                                      Related Orders ({item.relatedOrders.length})
                                  </h4>
                                  {item.relatedOrders.length > 0 ? (
                                      <div className="space-y-2 max-h-40 overflow-y-auto">
                                        {item.relatedOrders.map((order, orderIndex) => (
                                          <div key={orderIndex} className="text-sm bg-gray-50 p-2 rounded">
                                            <div><span className="font-medium">User:</span> {order.userName}</div>
                                            <div><span className="font-medium">Status:</span> 
                                              <Badge 
                                                variant={order.status === 'completed' ? 'default' : 
                                                        order.status === 'pending' ? 'secondary' : 'destructive'}
                                                className="ml-1"
                                              >
                                                {order.status}
                                              </Badge>
                                            </div>
                                            <div><span className="font-medium">Price:</span> ${order.finalPrice.toFixed(2)}</div>
                                            <div><span className="font-medium">Date:</span> {format(new Date(order.date), 'MMM dd, yyyy')}</div>
                                          </div>
                                        ))}
                                      </div>
                                  ) : (
                                    <p className="text-sm text-gray-500">No orders found for this plan</p>
                                  )}
                                </div>
                              </div>

                              <div className="flex justify-end mt-6">
                                  <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() =>
                                          handlePermanentDelete(item._id)
                                      }
                                  >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Permanently Delete
                                  </Button>
                              </div>
                          </CardContent>
                      </Card>
                  ))}
              </div>
          )}
      </div>
  );
};

export default AdminDeletedPlansArchive;
