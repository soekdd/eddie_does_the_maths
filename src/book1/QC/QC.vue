<!-- i18n-ally-scope: useI18n("book1.QC") -->
<template>
  <AppFrame
    :sub-chapter="subChapter"
    :title="t('title')"
    :vue-date="__VITE_SFC_MTIME_MS__"
  >
    <template #bookPart>
      <h3 id="stockholm">{{ t('subChapter.stockholm') }}</h3>
      <div class="eddie">
        <p v-html="t('book.p1')" />
        <p v-html="t('book.p2')" />
        <p v-html="t('book.p3')" />
        <p v-html="t('book.p4')" />
        <p v-html="t('book.p5')" />
        <p v-html="t('book.p6')" />
      </div>
    </template>

    <template #descriptionPart>
      <h2 id="problem">{{ t('sections.problem.title') }}</h2>
      <div class="eddie">
        <p v-html="t('sections.problem.p1')" />
        <p v-html="t('sections.problem.p2')" />
      </div>

      <h2 id="idea" class="mt-8">{{ t('sections.idea.title') }}</h2>
      <div class="eddie">
        <p v-html="t('sections.idea.p1')" />
        <p v-html="t('sections.idea.p2')" />
        <ul>
          <li v-html="t('sections.idea.l1')" />
          <li v-html="t('sections.idea.l2')" />
        </ul>
        <p v-html="t('sections.idea.p3')" />
      </div>

      <h2 id="computer" class="mt-8">{{ t('sections.computer.title') }}</h2>
      <div class="eddie">
        <p v-html="t('sections.computer.p1')" />
        <p v-html="t('sections.computer.p2')" />
        <p v-html="t('sections.computer.p3')" />
      </div>
    </template>

    <template #interactivePart>
      <h2 id="interactive">{{ t('sections.interactive.title') }}</h2>
      <div class="eddie d-flex flex-column ga-4">
        <p v-html="t('sections.interactive.intro')" />

        <QCGraph
          v-model="currentIndex"
          :configurations="sampleConfigurations"
          :title="t('sections.interactive.graphTitle')"
          :width="720"
          :height="720"
          :node-radius="5"
        />
      </div>
    </template>

    <template #footer>
      <div class="eddie footnote">
        <p v-html="t('footnote.p1')" />
      </div>
    </template>
  </AppFrame>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useI18n } from '@/utils/i18n.mjs';
import QCGraph from './QCGraph.vue';
import { parseU2822Conf } from './parser';

const { t, tm } = useI18n('book1.QC');

const sampleText = `1
10 6 16 0
0
 1  3    2  9  6
 2  4    3  8  9  1
 3  4    4  7  8  2
 4  3    5  7  3
 5  4    6 10  7  4
 6  4    1  9 10  5
 7  5   10  8  3  4  5
 8  5    7 10  9  2  3
 9  5    2  8 10  6  1
10  5    9  8  7  5  6
1024 1024 1024 1024 1024 1024 1024 1024 
1024 1024 

2
11 7 39 0
0
 1  3    2  8  7
 2  4    3 11  8  1
 3  4    4 10 11  2
 4  3    5 10  3
 5  4    6  9 10  4
 6  3    7  9  5
 7  4    1  8  9  6
 8  5    2 11  9  7  1
 9  6    8 11 10  5  6  7
10  5    9 11  3  4  5
11  5   10  9  8  2  3
1024 1024 1024 1024 1024 1024 1024 1024 
1024 1024 1024 

3
15 8 111 0
0
 1  3    2 14  8
 2  4    3 15 14  1
 3  5    4 12 11 15  2
 4  4    5 13 12  3
 5  3    6 13  4
 6  4    7  9 13  5
 7  5    8 10 11  9  6
 8  4    1 14 10  7
 9  5    7 11 12 13  6
10  5   14 15 11  7  8
11  6   10 15  3 12  9  7
12  5   13  9 11  3  4
13  5    6  9 12  4  5
14  5    2 15 10  8  1
15  5    3 11 10 14  2
1024 1024 1024 1024 1024 1024 1024 1024 
1024 1024 1024 1024 1024 1024 1024 
`;

const sampleConfigurations = parseU2822Conf(sampleText);
const currentIndex = ref(1);
const subChapter = computed(() => tm('subChapter') ?? {});
</script>

<style scoped>
.footnote {
  font-size: 0.95rem;
  opacity: 0.92;
}
</style>
