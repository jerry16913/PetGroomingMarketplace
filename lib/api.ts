import type {
  Category,
  Service,
  Groomer,
  Booking,
  Review,
  Resource,
  Pet,
  ServiceResourceRule,
  ResourceType,
} from '@/types';
import {
  categories as _categories,
  services as _services,
  groomers as _groomers,
  bookings as _bookings,
  reviews as _reviews,
  resources as _resources,
  pets as _pets,
  serviceResourceRules as _serviceResourceRules,
} from '@/lib/mock';

// ---------------------------------------------------------------------------
// Module-level mutable copies so the originals are never mutated.
// ---------------------------------------------------------------------------
let categoriesData: Category[] = structuredClone(_categories);
let servicesData: Service[] = structuredClone(_services);
let groomersData: Groomer[] = structuredClone(_groomers);
let bookingsData: Booking[] = structuredClone(_bookings);
let reviewsData: Review[] = structuredClone(_reviews);
let resourcesData: Resource[] = structuredClone(_resources);
let petsData: Pet[] = structuredClone(_pets);
const serviceResourceRulesData: ServiceResourceRule[] = structuredClone(
  _serviceResourceRules,
);

const delay = () => new Promise<void>((r) => setTimeout(r, 200));

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  await delay();
  return categoriesData;
}

export async function getCategoryByKey(
  key: string,
): Promise<Category | undefined> {
  await delay();
  return categoriesData.find((c) => c.key === key);
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export async function getServices(categoryId?: string): Promise<Service[]> {
  await delay();
  if (categoryId) {
    return servicesData.filter((s) => s.categoryId === categoryId);
  }
  return servicesData;
}

export async function getService(id: string): Promise<Service | undefined> {
  await delay();
  return servicesData.find((s) => s.id === id);
}

// ---------------------------------------------------------------------------
// Groomers
// ---------------------------------------------------------------------------

export async function getGroomers(
  filters?: {
    minRating?: number;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    sort?: 'rating' | 'price_asc' | 'price_desc';
  },
): Promise<Groomer[]> {
  await delay();

  let result = [...groomersData];

  if (filters) {
    if (filters.minRating !== undefined) {
      result = result.filter((p) => p.ratingAvg >= filters.minRating!);
    }

    if (filters.status) {
      result = result.filter((p) => p.status === filters.status);
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      result = result.filter((p) => {
        const prices = p.services.map((ps) => {
          if (ps.priceOverride !== undefined) return ps.priceOverride;
          const svc = servicesData.find((s) => s.id === ps.serviceId);
          return svc?.basePrice ?? 0;
        });
        const minP = Math.min(...prices);
        if (filters.minPrice !== undefined && minP < filters.minPrice) {
          return false;
        }
        if (filters.maxPrice !== undefined && minP > filters.maxPrice) {
          return false;
        }
        return true;
      });
    }

    if (filters.sort === 'rating') {
      result.sort((a, b) => b.ratingAvg - a.ratingAvg);
    } else if (filters.sort === 'price_asc' || filters.sort === 'price_desc') {
      const getMinPrice = (p: Groomer) => {
        const prices = p.services.map((ps) => {
          if (ps.priceOverride !== undefined) return ps.priceOverride;
          const svc = servicesData.find((s) => s.id === ps.serviceId);
          return svc?.basePrice ?? 0;
        });
        return Math.min(...prices);
      };
      result.sort((a, b) =>
        filters.sort === 'price_asc'
          ? getMinPrice(a) - getMinPrice(b)
          : getMinPrice(b) - getMinPrice(a),
      );
    }
  }

  return result;
}

export async function getGroomer(
  id: string,
): Promise<Groomer | undefined> {
  await delay();
  return groomersData.find((p) => p.id === id);
}

export async function approveGroomer(
  id: string,
): Promise<Groomer> {
  await delay();
  const idx = groomersData.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error(`Groomer ${id} not found`);
  groomersData[idx] = { ...groomersData[idx], status: 'approved' };
  return groomersData[idx];
}

export async function suspendGroomer(
  id: string,
): Promise<Groomer> {
  await delay();
  const idx = groomersData.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error(`Groomer ${id} not found`);
  groomersData[idx] = { ...groomersData[idx], status: 'suspended' };
  return groomersData[idx];
}

// ---------------------------------------------------------------------------
// Pets
// ---------------------------------------------------------------------------

export async function getPets(ownerId: string): Promise<Pet[]> {
  await delay();
  return petsData.filter((p) => p.ownerId === ownerId);
}

export async function getPet(id: string): Promise<Pet | undefined> {
  await delay();
  return petsData.find((p) => p.id === id);
}

export async function createPet(
  payload: Omit<Pet, 'id'>,
): Promise<Pet> {
  await delay();
  const newPet: Pet = {
    ...payload,
    id: Date.now().toString(),
  };
  petsData = [...petsData, newPet];
  return newPet;
}

export async function updatePet(
  id: string,
  data: Partial<Pet>,
): Promise<Pet> {
  await delay();
  const idx = petsData.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error(`Pet ${id} not found`);
  petsData[idx] = { ...petsData[idx], ...data };
  return petsData[idx];
}

export async function deletePet(id: string): Promise<void> {
  await delay();
  const idx = petsData.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error(`Pet ${id} not found`);
  petsData = petsData.filter((p) => p.id !== id);
}

// ---------------------------------------------------------------------------
// Service Resource Rules
// ---------------------------------------------------------------------------

export async function getServiceResourceRules(): Promise<
  ServiceResourceRule[]
> {
  await delay();
  return serviceResourceRulesData;
}

export async function getServiceResourceRule(
  serviceId: string,
): Promise<ServiceResourceRule | undefined> {
  await delay();
  return serviceResourceRulesData.find((r) => r.serviceId === serviceId);
}

// ---------------------------------------------------------------------------
// Resource auto-assignment helpers (internal, no delay)
// ---------------------------------------------------------------------------

function getOccupiedResourceIds(startAt: string, endAt: string): Set<string> {
  const newStart = new Date(startAt).getTime();
  const newEnd = new Date(endAt).getTime();

  const occupied = new Set<string>();

  for (const b of bookingsData) {
    if (b.status === 'cancelled' || b.status === 'no_show') continue;
    const bStart = new Date(b.startAt).getTime();
    const bEnd = new Date(b.endAt).getTime();
    // Check time overlap
    if (newStart < bEnd && newEnd > bStart) {
      for (const rid of b.assignedResourceIds) {
        occupied.add(rid);
      }
    }
  }

  return occupied;
}

/**
 * Auto-assign resources for a booking based on service resource rules.
 * Returns the list of assigned resource IDs.
 * Throws RESOURCE_UNAVAILABLE if a required resource cannot be fulfilled.
 */
export async function autoAssignResources(
  serviceId: string,
  startAt: string,
  endAt: string,
): Promise<{ assignedIds: string[]; assignments: { type: ResourceType; resourceId: string; resourceName: string; required: boolean }[] }> {
  await delay();

  const rule = serviceResourceRulesData.find((r) => r.serviceId === serviceId);
  if (!rule) {
    // No resource rule for this service — no resources needed
    return { assignedIds: [], assignments: [] };
  }

  const occupied = getOccupiedResourceIds(startAt, endAt);
  const assignedIds: string[] = [];
  const assignments: { type: ResourceType; resourceId: string; resourceName: string; required: boolean }[] = [];

  for (const req of rule.requirements) {
    // Find available resources of the required type
    const available = resourcesData.filter(
      (r) =>
        r.type === req.type &&
        r.isActive &&
        !occupied.has(r.id) &&
        !assignedIds.includes(r.id),
    );

    const picked = available.slice(0, req.count);

    if (picked.length < req.count && req.required) {
      throw new Error('RESOURCE_UNAVAILABLE');
    }

    for (const r of picked) {
      assignedIds.push(r.id);
      assignments.push({
        type: req.type,
        resourceId: r.id,
        resourceName: r.name,
        required: req.required,
      });
    }
  }

  return { assignedIds, assignments };
}

// ---------------------------------------------------------------------------
// Bookings
// ---------------------------------------------------------------------------

export async function getBookings(
  filters?: {
    groomerId?: string;
    status?: string;
    customerEmail?: string;
  },
): Promise<Booking[]> {
  await delay();

  let result = [...bookingsData];

  if (filters) {
    if (filters.groomerId) {
      result = result.filter(
        (b) => b.groomerId === filters.groomerId,
      );
    }
    if (filters.status) {
      result = result.filter((b) => b.status === filters.status);
    }
    if (filters.customerEmail) {
      result = result.filter(
        (b) => b.customerEmail === filters.customerEmail,
      );
    }
  }

  return result;
}

export async function getBooking(id: string): Promise<Booking | undefined> {
  await delay();
  return bookingsData.find((b) => b.id === id);
}

export async function createBooking(
  payload: Omit<Booking, 'id' | 'createdAt'>,
): Promise<Booking> {
  await delay();

  // If no resources were pre-assigned, attempt auto-assignment
  let finalResourceIds = payload.assignedResourceIds;
  if (!finalResourceIds || finalResourceIds.length === 0) {
    const result = await autoAssignResources(
      payload.serviceId,
      payload.startAt,
      payload.endAt,
    );
    finalResourceIds = result.assignedIds;
  } else {
    // Validate pre-assigned resources are not occupied
    const occupied = getOccupiedResourceIds(payload.startAt, payload.endAt);
    for (const rid of finalResourceIds) {
      if (occupied.has(rid)) {
        throw new Error('RESOURCE_UNAVAILABLE');
      }
    }
  }

  const newBooking: Booking = {
    ...payload,
    assignedResourceIds: finalResourceIds,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  bookingsData = [...bookingsData, newBooking];
  return newBooking;
}

export async function updateBookingStatus(
  id: string,
  status: Booking['status'],
): Promise<Booking> {
  await delay();
  const idx = bookingsData.findIndex((b) => b.id === id);
  if (idx === -1) throw new Error(`Booking ${id} not found`);
  bookingsData[idx] = { ...bookingsData[idx], status };
  return bookingsData[idx];
}

export async function updatePaymentStatus(
  id: string,
  status: Booking['paymentStatus'],
): Promise<Booking> {
  await delay();
  const idx = bookingsData.findIndex((b) => b.id === id);
  if (idx === -1) throw new Error(`Booking ${id} not found`);
  bookingsData[idx] = { ...bookingsData[idx], paymentStatus: status };
  return bookingsData[idx];
}

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

export async function getReviews(
  groomerId?: string,
): Promise<Review[]> {
  await delay();
  if (groomerId) {
    return reviewsData.filter((r) => r.groomerId === groomerId);
  }
  return reviewsData;
}

export async function createReview(
  payload: Omit<Review, 'id' | 'createdAt'>,
): Promise<Review> {
  await delay();
  const newReview: Review = {
    ...payload,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  reviewsData = [...reviewsData, newReview];
  return newReview;
}

// ---------------------------------------------------------------------------
// Resources
// ---------------------------------------------------------------------------

export async function getResources(): Promise<Resource[]> {
  await delay();
  return resourcesData;
}

export async function createResource(
  payload: Omit<Resource, 'id'>,
): Promise<Resource> {
  await delay();
  const newResource: Resource = {
    ...payload,
    id: Date.now().toString(),
  };
  resourcesData = [...resourcesData, newResource];
  return newResource;
}

export async function updateResource(
  id: string,
  data: Partial<Resource>,
): Promise<Resource> {
  await delay();
  const idx = resourcesData.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error(`Resource ${id} not found`);
  resourcesData[idx] = { ...resourcesData[idx], ...data };
  return resourcesData[idx];
}

export async function toggleResourceActive(id: string): Promise<Resource> {
  await delay();
  const idx = resourcesData.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error(`Resource ${id} not found`);
  resourcesData[idx] = {
    ...resourcesData[idx],
    isActive: !resourcesData[idx].isActive,
  };
  return resourcesData[idx];
}

export async function deleteResource(id: string): Promise<void> {
  await delay();
  const idx = resourcesData.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error(`Resource ${id} not found`);
  resourcesData = resourcesData.filter((r) => r.id !== id);
}
