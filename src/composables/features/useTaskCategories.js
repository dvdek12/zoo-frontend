import { ref, watch } from 'vue';
import taskService from '../../services/task.service';
import { useDeleteConfirm } from '../useDeleteConfirm';
import { useToast } from '../useToast';
import { toArray, getErrorMessage } from '../../utils/normalize';

export function useTaskCategories() {
  const { showToast } = useToast();

  const categories = ref([]);
  const loading    = ref(false);
  const error      = ref(null);

  const form         = ref({ name: '' });
  const isSubmitting = ref(false);
  const formError    = ref(null);

  function mapCategory(c) {
    return {
      id:   c.id       ?? c.Id,
      name: c.category ?? c.Category ?? c.name ?? c.Name ?? '',
    };
  }

  async function fetchCategories() {
    loading.value = true;
    error.value   = null;
    try {
      const data      = await taskService.getAllCategories();
      categories.value = toArray(data).map(mapCategory);
    } catch (err) {
      error.value = getErrorMessage(err, 'Failed to load categories.');
    } finally {
      loading.value = false;
    }
  }

  async function createCategory() {
    formError.value    = null;
    isSubmitting.value = true;
    try {
      await taskService.createCategory({ Category: form.value.name.trim() });
      form.value.name = '';
      showToast('Category created!');
      await fetchCategories();
    } catch (err) {
      formError.value = getErrorMessage(err, 'Failed to create category.');
    } finally {
      isSubmitting.value = false;
    }
  }

  const catDelete = useDeleteConfirm(async (cat) => {
    await taskService.deleteCategory(cat.id);
    categories.value = categories.value.filter(c => c.id !== cat.id);
    showToast('Category deleted.');
  });

  watch(() => catDelete.deleteError.value, (err) => {
    if (err) showToast(err, 'error');
  });

  return {
    categories,
    loading,
    error,
    form,
    isSubmitting,
    formError,
    fetchCategories,
    createCategory,
    catDelete,
  };
}
