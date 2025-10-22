<script setup>
import { computed, ref } from 'vue'

const destination = ref('Seoul, South Korea')
const travelWindow = ref({
  start: '2025-05-20',
  end: '2025-05-24',
})
const searchQuery = ref('')
const selectedPlace = ref(null)

const recommendedPlaces = ref([
  {
    id: 1,
    name: 'Gyeongbokgung Palace',
    type: 'Historic Landmark',
    duration: '2 hrs',
    description:
      'Experience royal palaces, traditional hanbok rentals, and guard-changing ceremonies in the heart of Seoul.',
    tags: ['Culture', 'Architecture', 'Photography'],
  },
  {
    id: 2,
    name: 'Ikseon-dong Hanok Village',
    type: 'Cultural District',
    duration: '1.5 hrs',
    description:
      'Stroll through narrow alleys filled with artisan cafés, design studios, and hanok-style boutiques.',
    tags: ['Cafés', 'Shopping', 'Nightlife'],
  },
  {
    id: 3,
    name: 'Cheonggyecheon Stream',
    type: 'Urban Nature',
    duration: '1 hr',
    description:
      'Follow the illuminated stream walk, perfect for winding down evenings with street performances and art.',
    tags: ['Relaxing', 'Scenic', 'Evening'],
  },
  {
    id: 4,
    name: 'Bukchon Hanok Village',
    type: 'Cultural Heritage',
    duration: '2 hrs',
    description:
      'Capture panoramic city views across centuries-old rooftops and visit local craft workshops.',
    tags: ['Culture', 'Workshops', 'Viewpoints'],
  },
  {
    id: 5,
    name: 'Seoul Forest',
    type: 'Urban Park',
    duration: '2.5 hrs',
    description:
      'Bike-friendly park with deer gardens, art installations, and botanical conservatories.',
    tags: ['Outdoors', 'Family', 'Cycling'],
  },
  {
    id: 6,
    name: 'Dongdaemun Design Plaza',
    type: 'Design & Night Market',
    duration: '2 hrs',
    description:
      'Explore futurist architecture, design exhibitions, and the all-night food & fashion markets nearby.',
    tags: ['Design', 'Night Market', 'Trend'],
  },
])

const itinerary = ref([
  {
    id: 1,
    label: 'Day 1 • Heritage & Craft',
    theme: 'Historic immersion with tea tastings',
    stops: [],
  },
  {
    id: 2,
    label: 'Day 2 • Urban Nature',
    theme: 'Balance between green escapes and city energy',
    stops: [],
  },
  {
    id: 3,
    label: 'Day 3 • Nightscape & Design',
    theme: 'Late-night bites, design icons, and hidden bars',
    stops: [],
  },
])

const activeDayId = ref(itinerary.value[0].id)

const activeDay = computed(() =>
  itinerary.value.find((day) => day.id === activeDayId.value) ?? itinerary.value[0],
)

const filteredPlaces = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return recommendedPlaces.value
  return recommendedPlaces.value.filter((place) => {
    const text = `${place.name} ${place.type} ${place.description} ${place.tags.join(' ')}`.toLowerCase()
    return text.includes(query)
  })
})

const scheduledPlaceIds = computed(() =>
  new Set(
    itinerary.value.flatMap((day) => day.stops.map((stop) => stop.id)),
  ),
)

const mapQuery = computed(() => {
  if (selectedPlace.value) {
    return `${selectedPlace.value.name}, ${destination.value}`
  }
  return destination.value
})

const mapSrc = computed(
  () =>
    `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery.value)}&z=13&ie=UTF8&iwloc=&output=embed`,
)

function setActiveDay(id) {
  activeDayId.value = id
}

function focusPlace(place) {
  selectedPlace.value = place
}

function addToItinerary(place) {
  if (!activeDay.value) return
  if (scheduledPlaceIds.value.has(place.id)) {
    selectedPlace.value = place
    return
  }
  activeDay.value.stops.push({ ...place })
  selectedPlace.value = place
}

function removeStop(dayId, placeId) {
  const day = itinerary.value.find((item) => item.id === dayId)
  if (!day) return
  day.stops = day.stops.filter((stop) => stop.id !== placeId)
  if (selectedPlace.value?.id === placeId && !scheduledPlaceIds.value.has(placeId)) {
    selectedPlace.value = null
  }
}

function travelWindowLabel() {
  return `${travelWindow.value.start} → ${travelWindow.value.end}`
}
</script>

<template>
  <div class="grid min-h-screen grid-cols-1 bg-slate-100/60 lg:grid-cols-5">
    <aside
      class="flex min-h-screen flex-col border-slate-200/80 bg-white/80 backdrop-blur lg:col-span-2 lg:border-r"
    >
      <div class="border-b border-slate-200/70 px-8 py-6">
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-sky-500">
          AI travel studio
        </p>
        <h1 class="mt-2 text-2xl font-semibold text-slate-900">Design your Seoul escape</h1>
        <p class="mt-3 text-sm text-slate-500">
          Curate a smart itinerary with adaptive AI suggestions. Start by tuning your destination and
          vibe.
        </p>
      </div>

      <div class="flex flex-1 flex-col gap-6 overflow-y-auto px-8 py-6">
        <section class="space-y-4">
          <div>
            <label class="text-xs font-medium uppercase tracking-wide text-slate-500">Destination</label>
            <input
              v-model="destination"
              type="text"
              class="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              placeholder="Where are you headed?"
            />
          </div>
          <div>
            <label class="text-xs font-medium uppercase tracking-wide text-slate-500">Travel window</label>
            <div
              class="mt-1 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
            >
              <span class="font-medium text-slate-700">{{ travelWindowLabel() }}</span>
              <span class="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-400">
                flexible
              </span>
            </div>
          </div>
          <div>
            <label class="text-xs font-medium uppercase tracking-wide text-slate-500">Refine mood</label>
            <input
              v-model="searchQuery"
              type="text"
              class="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              placeholder="Search by vibe, e.g. cafés, design, nature"
            />
          </div>
        </section>

        <section class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Curated suggestions
            </h2>
            <span class="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-600">
              {{ filteredPlaces.length }} spots
            </span>
          </div>

          <div class="space-y-4">
            <article
              v-for="place in filteredPlaces"
              :key="place.id"
              class="group rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-xl"
              :class="{ 'ring-2 ring-sky-400/70': selectedPlace?.id === place.id }"
            >
              <header class="flex items-start justify-between">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    {{ place.type }}
                  </p>
                  <h3 class="mt-1 text-lg font-semibold text-slate-900">{{ place.name }}</h3>
                </div>
                <span class="rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold text-white">
                  {{ place.duration }}
                </span>
              </header>
              <p class="mt-3 text-sm leading-relaxed text-slate-600">
                {{ place.description }}
              </p>
              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="tag in place.tags"
                  :key="tag"
                  class="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500"
                >
                  #{{ tag }}
                </span>
              </div>
              <div class="mt-5 flex items-center justify-between gap-3">
                <button
                  class="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-sky-400 hover:text-sky-600"
                  @mouseenter="focusPlace(place)"
                  @focus="focusPlace(place)"
                >
                  Preview on map
                </button>
                <button
                  class="rounded-full bg-sky-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                  :disabled="scheduledPlaceIds.has(place.id)"
                  @click="addToItinerary(place)"
                >
                  {{ scheduledPlaceIds.has(place.id) ? 'Scheduled' : 'Add to day' }}
                </button>
              </div>
            </article>
          </div>
        </section>

        <section class="space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Daily structure
            </h2>
            <span class="text-xs font-medium text-slate-400">Tap a day to arrange stops</span>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              v-for="day in itinerary"
              :key="day.id"
              class="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition"
              :class="
                day.id === activeDayId
                  ? 'border-sky-400 bg-sky-500/10 text-sky-600 shadow'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-sky-200 hover:text-sky-500'
              "
              @click="setActiveDay(day.id)"
            >
              {{ day.label }}
            </button>
          </div>

          <div class="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-sm">
            <header class="flex items-center justify-between">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Focus day</p>
                <h3 class="mt-2 text-lg font-semibold text-slate-900">
                  {{ activeDay?.label }}
                </h3>
                <p class="text-sm text-slate-500">{{ activeDay?.theme }}</p>
              </div>
              <span class="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                {{ activeDay?.stops.length || 0 }} stops
              </span>
            </header>

            <div v-if="activeDay?.stops.length" class="mt-5 space-y-3">
              <div
                v-for="stop in activeDay.stops"
                :key="stop.id"
                class="flex items-start justify-between gap-3 rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3"
              >
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{{ stop.type }}</p>
                  <h4 class="mt-1 text-base font-semibold text-slate-900">{{ stop.name }}</h4>
                  <p class="mt-1 text-xs text-slate-500">Suggested stay · {{ stop.duration }}</p>
                </div>
                <button
                  class="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400 shadow-sm transition hover:text-rose-500"
                  @click="removeStop(activeDay.id, stop.id)"
                >
                  Remove
                </button>
              </div>
            </div>
            <div v-else class="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-5 text-center">
              <p class="text-sm font-medium text-slate-500">
                No stops yet. Add a suggestion to craft this day’s flow.
              </p>
            </div>
          </div>
        </section>
      </div>
    </aside>

    <section class="relative min-h-screen overflow-hidden lg:col-span-3">
      <div class="absolute inset-0">
        <iframe
          :src="mapSrc"
          title="Destination map"
          class="h-full w-full border-0"
          loading="lazy"
          referrerpolicy="no-referrer"
        ></iframe>
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-slate-900/10 via-transparent to-sky-500/20"></div>
      </div>

      <div class="relative z-10 flex h-full flex-col justify-between p-8">
        <div class="max-w-md rounded-3xl border border-white/40 bg-white/80 p-6 shadow-2xl backdrop-blur">
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Live focus</p>
          <h2 class="mt-2 text-2xl font-semibold text-slate-900">
            {{ selectedPlace ? selectedPlace.name : 'Exploring ' + destination }}
          </h2>
          <p class="mt-3 text-sm leading-relaxed text-slate-600">
            <span v-if="selectedPlace">
              {{ selectedPlace.description }}
            </span>
            <span v-else>
              Preview curated experiences and pin them onto your adaptive schedule. Hover over suggestions to
              inspect locations instantly.
            </span>
          </p>
          <div v-if="selectedPlace" class="mt-4 flex flex-wrap gap-2">
            <span class="rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              {{ selectedPlace.duration }} nearby
            </span>
            <span
              v-for="tag in selectedPlace.tags"
              :key="tag"
              class="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow"
            >
              #{{ tag }}
            </span>
          </div>
        </div>

        <div class="grid gap-4 lg:grid-cols-2">
          <div class="rounded-3xl border border-white/40 bg-white/80 p-5 shadow-xl backdrop-blur">
            <p class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">AI insights</p>
            <h3 class="mt-2 text-lg font-semibold text-slate-900">Smart sequencing tip</h3>
            <p class="mt-3 text-sm text-slate-600">
              Start your mornings with cultural immersions while the venues are calm, then flow into nature-rich
              afternoons before heading to vibrant night markets.
            </p>
          </div>
          <div class="rounded-3xl border border-white/40 bg-white/80 p-5 shadow-xl backdrop-blur">
            <p class="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Energy meter</p>
            <h3 class="mt-2 text-lg font-semibold text-slate-900">Balanced pace</h3>
            <p class="mt-3 text-sm text-slate-600">
              You have {{ scheduledPlaceIds.size }} curated experiences locked in. Add up to 6 per day to keep the
              trip energising yet unhurried.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
