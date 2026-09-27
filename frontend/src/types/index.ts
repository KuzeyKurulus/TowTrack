export interface Customer {
  id: number;
  fullName: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  note?: string | null;
  createdAt: string;
  vehicleCount: number;
  jobCount: number;
}

export interface CustomerDetail extends Customer {
  vehicles: Vehicle[];
  jobs: JobListItem[];
}

export interface CreateCustomerInput {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  note?: string;
}

export interface Vehicle {
  id: number;
  customerId: number;
  customerName: string;
  plate: string;
  brand: string;
  model: string;
  modelYear: number;
  color?: string | null;
  chassisNumber?: string | null;
  mileage?: number | null;
  note?: string | null;
}

export interface CreateVehicleInput {
  customerId: number;
  plate: string;
  brand: string;
  model: string;
  modelYear: number;
  color?: string;
  chassisNumber?: string;
  mileage?: number;
  note?: string;
}

export type TowTruckStatus = 'Müsait' | 'Görevde' | 'Bakımda' | 'Pasif';

export interface TowTruck {
  id: number;
  plate: string;
  brand: string;
  model: string;
  modelYear: number;
  vehicleType: string;
  capacity: number;
  status: TowTruckStatus;
  lastMaintenanceDate?: string | null;
  note?: string | null;
}

export interface CreateTowTruckInput {
  plate: string;
  brand: string;
  model: string;
  modelYear: number;
  vehicleType: string;
  capacity: number;
  status: TowTruckStatus;
  lastMaintenanceDate?: string;
  note?: string;
}

export type DriverStatus = 'Aktif' | 'İzinli' | 'Pasif';

export interface Driver {
  id: number;
  fullName: string;
  phone: string;
  licenseClass?: string | null;
  hireDate: string;
  status: DriverStatus;
  note?: string | null;
  jobCount: number;
}

export interface CreateDriverInput {
  fullName: string;
  phone: string;
  licenseClass?: string;
  hireDate: string;
  status: DriverStatus;
  note?: string;
}

export type JobType = 'Oto Kurtarma' | 'Çekici' | 'Yol Yardım' | 'Kaza' | 'Arıza' | 'Diğer';
export type JobStatusValue = 'Bekliyor' | 'Atandı' | 'Yolda' | 'İşlemde' | 'Tamamlandı' | 'İptal';
export type PaymentStatusValue = 'Ödenmedi' | 'Kısmen Ödendi' | 'Ödendi';

export interface JobListItem {
  id: number;
  jobNumber: string;
  requestDate: string;
  customerName: string;
  plate: string;
  towTruckPlate?: string | null;
  driverName?: string | null;
  jobType: JobType;
  price: number;
  paymentStatus: PaymentStatusValue;
  jobStatus: JobStatusValue;
}

export interface JobDetail {
  id: number;
  jobNumber: string;
  customerId: number;
  customerName: string;
  customerPhone: string;
  vehicleId: number;
  vehiclePlate: string;
  vehicleBrandModel: string;
  towTruckId?: number | null;
  towTruckPlate?: string | null;
  driverId?: number | null;
  driverName?: string | null;
  requestDate: string;
  startDate?: string | null;
  completedDate?: string | null;
  pickupAddress: string;
  destinationAddress: string;
  jobType: JobType;
  description?: string | null;
  distanceKm: number;
  price: number;
  paymentStatus: PaymentStatusValue;
  jobStatus: JobStatusValue;
  createdAt: string;
}

export interface CreateJobInput {
  customerId: number;
  vehicleId: number;
  towTruckId?: number;
  driverId?: number;
  pickupAddress: string;
  destinationAddress: string;
  jobType: JobType;
  description?: string;
  distanceKm: number;
  price: number;
  paymentStatus: PaymentStatusValue;
}

export interface UpdateJobInput extends CreateJobInput {
  jobStatus: JobStatusValue;
}

export interface JobFilter {
  jobNumber?: string;
  plate?: string;
  customerName?: string;
  startDate?: string;
  endDate?: string;
  jobStatus?: string;
  paymentStatus?: string;
  jobType?: string;
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface DashboardSummary {
  totalJobs: number;
  todaysJobs: number;
  pendingJobs: number;
  completedJobs: number;
  totalRevenue: number;
  monthlyRevenue: number;
  activeTowTrucks: number;
  registeredCustomers: number;
  recentJobs: JobListItem[];
  jobStatusDistribution: StatusCount[];
  monthlyRevenueChart: MonthlyRevenue[];
}

export interface TowTruckUsage {
  plate: string;
  jobCount: number;
}

export interface DriverStats {
  fullName: string;
  jobCount: number;
  totalRevenue: number;
}

export interface Reports {
  dailyRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  totalCompletedJobs: number;
  jobTypeDistribution: StatusCount[];
  paymentStatusDistribution: StatusCount[];
  towTruckUsage: TowTruckUsage[];
  driverStats: DriverStats[];
  revenueChart: MonthlyRevenue[];
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
}
