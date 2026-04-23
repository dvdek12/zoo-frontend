<template>
  <div class="flex-1 flex flex-col h-full overflow-hidden relative">
    <!-- TOP HEADER -->
    <header class="flex items-center justify-between px-8 py-5 shrink-0">
      <!-- Search -->
      <div class="relative w-[32rem]">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          <Search class="w-4 h-4" />
        </div>
        <input type="text" placeholder="Search zoological records..." class="w-full pl-11 pr-4 py-2 bg-[#e4e3d9]/50 hover:bg-[#e4e3d9] focus:bg-[#e4e3d9] rounded-full text-sm font-medium text-gray-700 placeholder-gray-500 focus:outline-none transition-colors border-none" />
      </div>

      <!-- Right Header Items -->
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-4 text-gray-600">
          <button class="hover:text-black transition-colors"><Bell class="w-5 h-5" /></button>
          <button class="hover:text-black transition-colors"><MonitorUp class="w-5 h-5" /></button>
        </div>
        <button class="bg-[#1a3b22] hover:bg-[#122a18] text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors">
          Add Entry
        </button>
        <img src="https://i.pravatar.cc/100?img=11" alt="Warden Mitchell" class="w-9 h-9 rounded-full ring-2 ring-transparent transition-all cursor-pointer" />
      </div>
    </header>

    <!-- SCROLLABLE CONTENT -->
    <div class="flex-1 overflow-y-auto px-10 py-6 pb-20 relative scroll-smooth h-full">
      <!-- Main Header -->
      <div class="mb-10 max-w-3xl">
        <h2 class="text-4xl font-extrabold text-[#1a3b22] tracking-tight mb-3">Report Generator</h2>
        <p class="text-gray-600 text-[15px] font-medium leading-relaxed">Create high-precision zoological data exports for conservation monitoring, dietary compliance, and administrative oversight.</p>
      </div>

      <div class="flex flex-col items-center justify-center w-full my-6">
        <!-- LEFT COLUMN: Config -->
        <div class="w-full max-w-xl shrink-0 flex flex-col gap-6">
          <!-- Configuration Card -->
          <div class="bg-[#f6f5f0] rounded-[2rem] p-7 shadow-sm">
            <h3 class="flex items-center gap-2 font-bold text-[#1a3b22] text-lg mb-6">
              <SlidersHorizontal class="w-5 h-5" /> Configuration
            </h3>

            <!-- Date Range -->
            <div class="mb-6">
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Date Range</label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Calendar class="w-4 h-4" />
                  </div>
                  <input type="text" value="10/01/2023" class="w-full pl-10 pr-10 py-2.5 bg-[#e9e8e2] rounded-xl text-sm font-semibold text-gray-700 outline-none" />
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                    <CalendarDays class="w-4 h-4" />
                  </div>
                </div>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Calendar class="w-4 h-4" />
                  </div>
                  <input type="text" value="10/31/2023" class="w-full pl-10 pr-10 py-2.5 bg-[#e9e8e2] rounded-xl text-sm font-semibold text-gray-700 outline-none" />
                  <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                    <CalendarDays class="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Export Format -->
            <div class="mb-8">
              <label class="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Export Format</label>
              <div class="flex gap-3">
                <button class="flex-1 flex items-center justify-center gap-2 bg-white text-[#1a3b22] px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm border border-gray-100">
                  <FileText class="w-4 h-4" /> PDF
                </button>
                <button class="flex-1 flex items-center justify-center gap-2 bg-white text-gray-500 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm border border-gray-100 hover:text-[#1a3b22]">
                  <FileSpreadsheet class="w-4 h-4" /> CSV
                </button>
              </div>
            </div>

            <!-- Generate Button -->
            <button class="w-full flex items-center justify-center gap-2 bg-[#1a3b22] hover:bg-[#112a17] text-white py-4 rounded-full font-bold text-sm shadow-md transition-colors mb-4">
              <Zap class="w-4 h-4" /> Generate Report
            </button>
            <p class="text-[10px] text-gray-400 font-medium text-center leading-snug px-2">Processing usually takes less than 30 seconds depending on data volume.</p>
          </div>

          <!-- Active Monitoring Card -->
          <div class="bg-[#485f47] rounded-[1.5rem] p-6 shadow-sm flex items-center justify-between text-white relative overflow-hidden">
            <div class="z-10">
              <h4 class="text-[9px] font-bold text-[#b5cfb5] uppercase tracking-widest mb-1">Active Monitoring</h4>
              <div class="text-2xl font-extrabold tracking-tight">128 Habitats</div>
            </div>
            <div class="z-10">
              <Sprout class="w-8 h-8 text-[#8ca88b]" />
            </div>
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
          </div>
        </div>


      </div>

      <!-- BOTTOM SECTION: Recent History -->
      <div class="mt-12">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-bold text-[#1a3b22] text-xl">Recent History</h3>
          <div class="flex items-center gap-3">
            <button class="p-2 hover:bg-gray-200 rounded-full text-gray-600 transition-colors">
              <ListFilter class="w-4 h-4" />
            </button>
            <button class="p-2 hover:bg-gray-200 rounded-full text-gray-600 transition-colors">
              <RefreshCw class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden text-sm">
          <table class="w-full text-left">
            <thead class="bg-[#f0efea]">
              <tr>
                <th class="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-500 w-[40%]">Report Name</th>
                <th class="px-6 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-500">Date Generated</th>
                <th class="px-6 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-500">Status</th>
                <th class="px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-500 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100/60">
              <tr class="hover:bg-gray-50/50 transition-colors">
                <td class="px-8 py-6 font-bold text-[#1a3b22]">Q3 Veterinary Summary.pdf</td>
                <td class="px-6 py-6 text-gray-500 text-[13px]">Oct 14, 2023 · 09:42 AM</td>
                <td class="px-6 py-6">
                  <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e1eae2] text-[#1a3b22] text-[9px] uppercase font-bold rounded-full tracking-wider">
                    <div class="w-1 h-1 rounded-full bg-[#1a3b22]"></div> Completed
                  </div>
                </td>
                <td class="px-8 py-6 text-right">
                  <button class="text-gray-400 hover:text-black transition-colors"><Download class="w-5 h-5 mx-auto" /></button>
                </td>
              </tr>
              <tr class="hover:bg-gray-50/50 transition-colors">
                <td class="px-8 py-6 font-bold text-[#1a3b22]">Great Panda Habitat Metrics.csv</td>
                <td class="px-6 py-6 text-gray-500 text-[13px]">Oct 12, 2023 · 02:15 PM</td>
                <td class="px-6 py-6">
                  <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e1eae2] text-[#1a3b22] text-[9px] uppercase font-bold rounded-full tracking-wider">
                    <div class="w-1 h-1 rounded-full bg-[#1a3b22]"></div> Completed
                  </div>
                </td>
                <td class="px-8 py-6 text-right">
                  <button class="text-gray-400 hover:text-black transition-colors"><Download class="w-5 h-5 mx-auto" /></button>
                </td>
              </tr>
              <tr class="hover:bg-gray-50/50 transition-colors">
                <td class="px-8 py-6 font-bold text-[#1a3b22]">Annual Conservation Impact.pdf</td>
                <td class="px-6 py-6 text-gray-500 text-[13px]">Oct 10, 2023 · 11:00 AM</td>
                <td class="px-6 py-6">
                  <div class="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ffecec] text-[#ba2a2a] text-[9px] uppercase font-bold rounded-full tracking-wider">
                    <div class="w-1 h-1 rounded-full bg-[#ba2a2a]"></div> Expired
                  </div>
                </td>
                <td class="px-8 py-6 text-right">
                  <button class="text-gray-400 hover:text-black transition-colors"><History class="w-4 h-4 mx-auto" /></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  Search,
  Bell,
  MonitorUp,
  SlidersHorizontal,
  Calendar,
  CalendarDays,
  FileText,
  FileSpreadsheet,
  Zap,
  Sprout,
  ListFilter,
  RefreshCw,
  Download,
  History
} from 'lucide-vue-next';
</script>
