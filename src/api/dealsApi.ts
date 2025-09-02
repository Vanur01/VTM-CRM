import axios from '../utils/axios';

export interface Deal {
  _id: string;
  dealName: string;
  accountName: string;
  dealOwner: string;
  amount: string;
  rawAmount: number;
  closingDate: string;
  rawDate: string;
  probability: number;
  expectedRevenue: number;
  type: string;
  leadSource: string;
}

export interface DealStage {
  stage: string;
  totalAmount: number;
  deals: Deal[];
}

export interface DealsResponse {
  statusCode: number;
  status: string;
  message: string;
  data: DealStage[];
}

export interface CreateDealPayload {
  dealName: string;
  accountName: string;
  amount: string;
  closingDate: string;
  probability: number;
  type: string;
  leadSource: string;
  stage?: string; 
  expectedRevenue: number; // Required as a number
  nextStep?: string;
  dealOwner?: string; // Optional field
}

export interface UpdateDealStagePayload {
  newStage: string;
}

export interface DealFilters {
  dealName?: string;
  type?: string;
  leadSource?: string;
  stage?: string;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
}



const dealApi = {
  getAllDeals: async (filters?: DealFilters) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }
      const queryString = queryParams.toString();
      const url = queryString ? `/deal/getAllDeals?${queryString}` : '/deal/getAllDeals';
      console.log('API URL:', url);
      const response = await axios.get<DealsResponse>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDeals: async (filters?: DealFilters) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== '') {
            queryParams.append(key, value.toString());
          }
        });
      }
      const queryString = queryParams.toString();
      const url = queryString ? `/deal/getDeals?${queryString}` : '/deal/getDeals';
      console.log('API URL:', url);
      const response = await axios.get<DealsResponse>(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDealById: async (id: string) => {
    try {
      const response = await axios.get(`/deal/getDeal/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createDeal: async (dealData: CreateDealPayload) => {
    try {
      const response = await axios.post('/deal/addDeal', dealData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateDeal: async (dealId: string, dealData: CreateDealPayload) => {
    try {
      const response = await axios.put(`/deal/updateDeal/${dealId}`, dealData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateDealStage: async (dealId: string, stageData: UpdateDealStagePayload) => {
    try {
      const response = await axios.put(`/deal/updateDealStage/${dealId}`, stageData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteDeal: async (dealId: string) => {
    try {
      const response = await axios.delete(`/deal/deleteDeal/${dealId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  bulkDeleteDeals: async (dealIds: string[]) => {
    try {
      const response = await axios.delete('/deal/deleteAllDeals', {
        data: { dealIds }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },



};

export default dealApi;
