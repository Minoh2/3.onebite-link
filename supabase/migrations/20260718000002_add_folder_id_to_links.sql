alter table public.links
  add column folder_id bigint;

alter table public.links
  add constraint links_folder_id_fkey
  foreign key (folder_id)
  references public.folders (id)
  on delete set null;
