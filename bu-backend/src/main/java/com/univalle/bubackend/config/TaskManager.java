package com.univalle.bubackend.config;

import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;

@Component
public class TaskManager {

    private final TaskScheduler taskScheduler;
    private final ConcurrentHashMap<Integer, ScheduledFuture<?>> scheduledTasks = new ConcurrentHashMap<>();

    public TaskManager(TaskScheduler taskScheduler) {
        this.taskScheduler = taskScheduler;
    }

    public void scheduleTask(Integer appointmentId, Runnable task, long delay) {
        ScheduledFuture<?> future = ((ThreadPoolTaskScheduler) taskScheduler)
                .schedule(task, new java.util.Date(System.currentTimeMillis() + delay));
        scheduledTasks.put(appointmentId, future);
    }

    public void cancelTask(Integer appointmentId) {
        ScheduledFuture<?> future = scheduledTasks.remove(appointmentId);
        if (future != null) {
            future.cancel(false);
        }
    }
}
