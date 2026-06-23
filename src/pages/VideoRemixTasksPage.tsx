import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Form, Input, Modal, Select, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ArrowRight, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createVideoRemixTask, deleteVideoRemixTask, getVideoRemixTaskPage } from "../api/aigc/video-remix-tasks";
import type { VideoRemixTask } from "../api/aigc/video-remix-tasks/types";
import { getVideoRemixTaskStatusMeta, videoRemixStatusOptions } from "../features/video-remix/status";
import { PageShell } from "../shared/components/PageShell";
import { StatusPill } from "../shared/components/StatusPill";

const listQueryKey = ["video-remix-tasks"];

interface CreateTaskFormValues {
  name: string;
  remark?: string;
}

export function VideoRemixTasksPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [createForm] = Form.useForm<CreateTaskFormValues>();
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<number | undefined>();
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [actionError, setActionError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const listQuery = useQuery({
    queryKey: [...listQueryKey, pageNum, pageSize, keyword, status],
    queryFn: () =>
      getVideoRemixTaskPage({
        pageNum,
        pageSize,
        keyword: keyword.trim() || undefined,
        status,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (taskId: VideoRemixTask["id"]) => deleteVideoRemixTask(taskId),
    onSuccess: async () => {
      setActionError("");
      await queryClient.invalidateQueries({ queryKey: listQueryKey });
    },
    onError: (error: Error) => {
      setActionError(error.message);
    },
  });

  const createMutation = useMutation({
    mutationFn: (values: CreateTaskFormValues) =>
      createVideoRemixTask({
        name: values.name.trim(),
        remark: values.remark?.trim() || undefined,
      }),
    onSuccess: async (task) => {
      setActionError("");
      setCreateOpen(false);
      createForm.resetFields();
      await queryClient.invalidateQueries({ queryKey: listQueryKey });
      navigate(`/viral-remix/tasks/${task.id}`);
    },
    onError: (error: Error) => {
      setActionError(error.message);
    },
  });

  async function handleCreateTask() {
    try {
      const values = await createForm.validateFields();
      createMutation.mutate(values);
    } catch {
      // 交给表单自身展示校验错误
    }
  }

  const columns = useMemo<ColumnsType<VideoRemixTask>>(
    () => [
      {
        title: "任务名称",
        dataIndex: "name",
        render: (_, task) => (
          <div className="space-y-1">
            <div className="text-[13px] font-medium text-[var(--text-primary)]">{task.name}</div>
            <div className="text-[11px] text-[var(--text-muted)]">{task.remark || "暂无备注"}</div>
          </div>
        ),
      },
      {
        title: "状态",
        width: 150,
        render: (_, task) => {
          const meta = getVideoRemixTaskStatusMeta(task);
          return <StatusPill label={meta.label} color={meta.color} background={meta.background} />;
        },
      },
      {
        title: "进度",
        width: 90,
        render: (_, task) => `${task.progress ?? 0}%`,
      },
      {
        title: "结果",
        render: (_, task) => {
          if (task.videoUrl) {
            return (
              <a
                className="text-[12px] text-[#4ADE80] underline-offset-2 hover:underline"
                href={task.videoUrl}
                target="_blank"
                rel="noreferrer"
              >
                查看成品
              </a>
            );
          }

          if (task.errReason) {
            return <span className="text-[12px] text-[#EF4444]">{task.errReason}</span>;
          }

          return <span className="text-[12px] text-[var(--text-muted)]">暂无结果</span>;
        },
      },
      {
        title: "更新时间",
        dataIndex: "updateTime",
        width: 180,
        render: (value?: string) => value || "-",
      },
      {
        title: "操作",
        width: 220,
        render: (_, task) => (
          <div className="flex gap-2">
            <Button size="small" icon={<ArrowRight size={12} />} onClick={() => navigate(`/viral-remix/tasks/${task.id}`)}>
              进入详情
            </Button>
            <Button
              size="small"
              danger
              icon={<Trash2 size={12} />}
              loading={deleteMutation.isPending}
              onClick={() => {
                if (window.confirm(`确认删除任务“${task.name}”吗？`)) {
                  deleteMutation.mutate(task.id);
                }
              }}
            >
              删除
            </Button>
          </div>
        ),
      },
    ],
    [deleteMutation.isPending, navigate],
  );

  return (
    <PageShell
      title="追爆任务"
      description="查看视频追爆任务的状态、进度、失败原因，并继续回到详情页编辑与生成。"
      actions={
        <Button
          type="primary"
          icon={<Plus size={14} />}
          onClick={() => {
            setCreateOpen(true);
            createForm.resetFields();
          }}
        >
          新建追爆任务
        </Button>
      }
    >
      {actionError ? (
        <Alert className="mb-4" type="error" showIcon message="操作失败" description={actionError} />
      ) : null}

      {listQuery.isError ? (
        <Alert className="mb-4" type="error" showIcon message="任务列表加载失败" description={(listQuery.error as Error).message} />
      ) : null}

      <div className="rounded-xl border border-[var(--line-subtle)] bg-[var(--card-bg)] p-4">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <Input
              allowClear
              className="max-w-md"
              prefix={<Search size={14} />}
              placeholder="搜索任务名称或备注"
              value={keyword}
              onChange={(event) => {
                setPageNum(1);
                setKeyword(event.target.value);
              }}
            />
            <Select
              allowClear
              className="min-w-[160px]"
              placeholder="按状态筛选"
              value={status}
              options={videoRemixStatusOptions}
              onChange={(value) => {
                setPageNum(1);
                setStatus(value);
              }}
            />
          </div>
          <Button icon={<RefreshCw size={14} />} loading={listQuery.isFetching} onClick={() => void listQuery.refetch()}>
            刷新列表
          </Button>
        </div>

        <Table
          rowKey="id"
          loading={listQuery.isLoading}
          columns={columns}
          dataSource={listQuery.data?.list ?? []}
          pagination={{
            current: pageNum,
            pageSize,
            total: listQuery.data?.total ?? 0,
            onChange: (nextPage, nextPageSize) => {
              setPageNum(nextPage);
              setPageSize(nextPageSize);
            },
          }}
          scroll={{ x: 980 }}
        />
      </div>

      <Modal
        title="创建视频追爆任务"
        open={createOpen}
        onCancel={() => {
          setCreateOpen(false);
          createForm.resetFields();
        }}
        onOk={() => void handleCreateTask()}
        confirmLoading={createMutation.isPending}
        okText="创建任务"
        cancelText="取消"
        width={1080}
        destroyOnHidden
      >
        <div className="border-t border-[var(--line-subtle)] pt-8">
          <div className="mx-auto max-w-[600px]">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-6 w-[3px] rounded-full bg-[#2563EB]" />
              <div className="text-[16px] font-semibold text-[#2563EB]">新建追爆任务</div>
            </div>

            <Form<CreateTaskFormValues> form={createForm} layout="vertical">
              <Form.Item
                name="name"
                label="任务名称"
                rules={[{ required: true, message: "请输入任务名称" }]}
              >
                <Input maxLength={128} placeholder="如：追爆-双11大促" showCount />
              </Form.Item>

              <Form.Item name="remark" label="备注">
                <Input.TextArea maxLength={512} rows={3} placeholder="可选" showCount />
              </Form.Item>
            </Form>

            <div className="rounded-lg bg-[#F5F7FB] px-4 py-3 text-[13px] text-[var(--text-secondary)]">
              <span className="mr-2 text-[#F59E0B]">💡</span>
              创建任务后，再次点击「编辑」按钮填写完整的素材与文案内容。
            </div>
          </div>
        </div>
      </Modal>
    </PageShell>
  );
}
